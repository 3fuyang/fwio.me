---
title: Reading React Source Code
description: Notes on reading the React source code.
lang: en
pubDate: 2025-02-11T20:00:00+08:00
draft: true
---

## Core Packages

- `react`
- `react-reconciler`
- `scheduler`

## Core Concepts

### ReactElement

Return value of `React.createElement`, always an object but not a `Fiber` yet.

> [!NOTE]
> `ReactNode` is the set of all possible return values of a component.

### Fiber

According to [the comments](https://github.com/facebook/react/blob/45463ab3ac3ed0e65dfdbbfd5e53a50a8384e909/packages/react-reconciler/src/ReactInternalTypes.js#L88) from the source code: a `Fiber` is work on a `Component` that needs to be done or was done. However, a `Fiber` also represents a React component in the React tree.

Thus a `Fiber` has two dimensions of meaning:

1. Virtual DOM - The core internal data structure that tracks all the current component instances in the application.
2. Node-level Work - The work scheduled to be done or was done on the node.

> According to [Mark's Dev Blog](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#rendering-process-overview), the term "Virtual DOM" was popularized to state that React does not create DOM nodes on every render, but no longer makes since modern frameworks assume no unnecessary DOM node creation.

Notably, all `Fiber` nodes are processed by [`beginWork()`](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.js#L3769), the return value of which decides the next step of the reconciliation process:

- `Fiber` - Keep processing the next fiber (work).
- `null` - We should stop and finish the current render.

> Reconciliation - The process of diffing render trees and collecting all the changes to be applied to reflect the updates in the UI.

The following are some key fields of the `Fiber` structure:

```ts
type Fiber = {
  // Unique identifier of this child.
  key: string | null

  // The local state associated with this fiber,
  // e.g. DOM node for `HostComponent`,
  //      instance for `ClassComponent`.
  stateNode: any

  // The `Fiber` to return to after finishing processing(dfs) this one,
  // most of the time it's the parent fiber.
  return: Fiber | null

  // Singly Linked List Tree Structure.
  child: Fiber | null
  sibling: Fiber | null
  // The index of the fiber in the parent's children array,
  // used in reconciliation.
  index: number

  // The ref last used to attach this node.
  ref: null | (((handle: any) => void) & { _stringRef?: string }) | RefObject
  refCleanup: null | (() => void)

  // The data coming into process this fiber.
  pendingProps: any
  // The props used to create the output.
  memoizedProps: any

  // A struct to manage updates,
  // like state updates and callbacks.
  updateQueue: any

  // The state used to create the output,
  // e.g. hooks for function components.
  memoizedState: any

  // Dependencies (contexts, events) for this fiber, if it has any.
  dependencies: Dependencies | null

  // Bit field to describe the render mode of this fiber,
  // e.g. `ConcurrentMode`, `NoStrictPassiveEffectsMode`, `StrictLegacyMode`.
  // When a fiber is created, it inherits the mode of its parent.
  // Additional flags can be set at creation time, but after that the value should remain unchanged throughout the fiber's lifetime.
  mode: TypeOfMode

  // Effects
  // NOTE: This does not refer to the effects from `useEffect()`.
  // But the effects of this fiber, like `Placement`, `Update`, `Deletion`.
  flags: Flags
  subtreeFlags: Flags
  deletions: Array<Fiber> | null

  // Priority level of the work on this fiber.
  lanes: Lanes
  // Priority level of the work on the subtree.
  childLanes: Lanes

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually has **a pair**. There are cases when we can clean up pairs to save
  // memory if we need to.
  alternate: Fiber | null
}
```

### Paint

This is not a React term but a browser concept. I put it here because it's important to first understand that it's we give the browser a chance to paint instead of we force it to do so. It's under browser's full control after all.

The real DOM nodes are already created or updated in the `commit` phase. Yeah, we can read and measure the latest DOM nodes at this moment (usually in `useLayoutEffect`) to do some side effects or even trigger another re-render (P.S. these re-renders will be run synchronously to avoid a partial UI), but the screen is not refreshed until we finally yield the JavaScript execution, and the browser will use this opportunity to actually paint.

### Hooks

`Hook`s are stored as a linked list on the `memoizedState` field of a Function Component's `Fiber`.

```ts
interface Hook {
  memoizedState: any // The current state it holds. This is the value returned by the hook, and consumed by the component.
  baseState: any // The initial state or the base state from which updates are derived. It is calculated during last render.

  queue: UpdateQueue | null // An object to manage updates on this hook. IMO `updateCtx` would be a better name.
  baseQueue: UpdateQueue | null // Similar to `queue`, but manages rebase updates.

  next: Hook | null // Singly linked list.
}
```

### UpdateQueue

`UpdateQueue` is the object that manages updates for its `Hook`.

```ts
interface UpdateQueue<S, A> {
  pending: Update<S, A> | null
  lanes: Lanes
  /** The `dispatch` function is **stable** across the component lifetime. */
  dispatch: (A => any) | null
  /** The reducer used in the last render. */
  lastRenderedReducer: ((S, A) => S) | null
  /** The state produced by the last render, which is compared with the current state to determine if we could skip the re-render. */
  lastRenderedState: S | null
}
```

## Crucial Process

### Bailout

Let's first recall how a typical React 18 app consisting of function components re-renders.

Imagine a minimal counter app: the `<Counter />` component lies in the downstream of the tree, and a click event handler schedules an update on the `Fiber` of this component.

```jsx
function App() {
  return (
    <A>
      <B>
        <Counter />
      </B>

      <C />
    </A>
  )
}

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <D />
    </div>
  )
}
```

First, here's how the update gets scheduled:

1. The `onClick` handler calls `setState()`, which calls the React builtin dispatcher function. Call chain: `setState() -> dispatchSetState() -> dispatchSetStateInternal() -> scheduleUpdateOnFiber()`.
2. In `scheduleUpdateOnFiber()`, the root will be marked with a pending update, and a rerender is scheduled via `ensureRootIsScheduled()`.
3. During rerender, `beginWork()` is called against the root `Fiber` node, which starts the reconciliation process.
4. In `beginWork()`, a strict equality comparison between `current.memoizedProps` and `workInProgress.pendingProps` will be made to determine if the component should enter the render phase.
5. If the two props are equal, and there are no updates detected on the fiber, we will enter `attemptEarlyBailoutIfNoScheduledUpdate()`. This function does some bookkeeping and then calls `bailoutOnAlreadyFinishedWork()`, which is the real bailout entry.
6. In `bailoutOnAlreadyFinishedWork()`, we check if the fiber's children has pending work. If not, we bail out and return `null` to signal the end of the current render. If there are pending work, we clone its child fibers and return them for further processing.
7. Back into our example, the steps 4, 5, and 6 are repeated for `<A />` and `<B />`.
8. When we reach `<Counter />`, the props are equal, but there's a pending update on the fiber. So we enter the `updateFunctionComponent()` with `didReceiveUpdate === false` (spoiler: for now).
9. In `updateFunctionComponent()`, before determining if a bailout is possible, we first call `renderWithHooks()`, which calls the function component and thus the hooks.
   - ```jsx
     // NOTE: There is a side effect,
     // which could mutate the `didReceiveUpdate` flag.
     function renderWithHooks() {
       // ...
       // Here we call the function component.
       let children = __DEV__
         ? callComponentInDEV(Component, props, secondArg)
         : Component(props, secondArg)
       // ...
     }
     ```
10. `useState()` eventually retrieves the `updateReducerImpl()` function. Call chain: `useState() -> updateState() -> updateReducer() -> updateReducerImpl()`.
11. In `updateReducerImpl()`, `newState` is calculated from the queued updates and compared with the current `hook.memoizedState`. Since the two states are different, `markWorkInProgressReceivedUpdate()` is called and now `didReceiveUpdate === true`.
12. Back to `updateFunctionComponent()`, after `renderWithHooks()` we have `didReceiveUpdate` as `true`, so we enter the reconciliation process of the `Fiber` children of `<Counter />`.

    - ```jsx
      function updateFunctionComponent() {
        // ...
        // When `didReceiveUpdate` is `true`, we don't bailout the reconciliation.
        if (current !== null && !didReceiveUpdate) {
          bailoutHooks(current, workInProgress, renderLanes)
          return bailoutOnAlreadyFinishedWork(
            current,
            workInProgress,
            renderLanes,
          )
        }

        // ...

        workInProgress.flags |= PerformedWork
        // Enter the reconciliation.
        reconcileChildren(current, workInProgress, nextChildren, renderLanes)
        return workInProgress.child
      }
      ```

There are two types of bail out:

1. Without entering `updateFunctionComponent()`, no updates on this fiber.
2. After entering `updateFunctionComponent()`.

## Random Notes

### Scheduling Microtasks

How React [schedules microtasks](https://github.com/facebook/react/blob/192555bb0ed88db30f91c58651c421f178f90384/packages/react-dom-bindings/src/client/ReactFiberConfigDOM.js#L696):

1. Use [`queueMicroTask`](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask) if available
2. Use `Promise` fulfillment callback if available
3. Use `setTimeout` with a 0ms delay as a fallback

> [**Using Microtasks**](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#using_microtasks)
> Microtasks themselves cannot break up long tasks. Instead, they allow scheduling code to jump in front of other things in the long set of things waiting to happen on the user's computer.
> The main reason to use microtasks is that: to ensure consistent ordering of tasks, even when results or data is available synchronously, but while simultaneously reducing the risk of user-discernible delays in operations.

### Scheduling Tasks

> Here the term "task" is used since macrotask is actually not a standard term. BTW the terminology is not crucial here, what React wants is to yield to the browser's event loop, avoiding long tasks.

How React [schedules tasks](https://github.com/facebook/react/blob/192555bb0ed88db30f91c58651c421f178f90384/packages/scheduler/src/forks/Scheduler.js#L516):

1. Use [`setImmediate`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate) if available.
2. Use `MessageChannel` if available, preferred because of the 4ms `setTimeout` clamping.
   - ```ts
     const channel = new MessageChannel()
     const port = channel.port2
     channel.port1.onmessage = performWorkUntilDeadline
     schedulePerformWorkUntilDeadline = () => {
       port.postMessage(null)
     }
     ```
3. Use `setTimeout` with a 0ms delay as a fallback

## Notes of Reading Community Posts

[Concurrent React for Library Maintainers · reactwg/react-18 · Discussion #70](https://github.com/reactwg/react-18/discussions/70)

When you change React state, React doesn’t immediately change the state. Instead, React queues the update and schedules a render. When React starts to render, it will then look at the entire queue of updates, and use different heuristics and algorithms to determine the next update to work on. This process has safeguards and semantics in place to ensure that rendering is always consistent.

- `setState` within `useEffect` is now async during rendering.
- `setState` during `useLayoutEffect` will be sync.

[Why `useSyncExternalStore` Is Not Used in Jotai · Daishi Kato's blog](https://blog.axlight.com/posts/why-use-sync-external-store-is-not-used-in-jotai/)

- `useState` does eager bail out while `useReducer` does not.
