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

Return value of `React.createElement`, always an object.

> [!NOTE] > `ReactNode` is the set of all possible return values of a component.

### Fiber

According to the code comment: a `Fiber` is work on a `Component` that needs to be done or was done. However, a `Fiber` also represents a React component in the React tree.

So a `Fiber` has two dimensions of meaning:

1. The work to be done or was done.
2. The internal representation of React components (like VNode) in your React app.

A few key fields of the `Fiber` structure:

```ts
type Fiber = {
  // Unique identifier of this child.
  key: string | null

  // The local state associated with this fiber,
  // e.g. DOM node for `HostComponent`,
  // or instance for `ClassComponent`.
  stateNode: any

  // The `Fiber` to return to after finishing processing(dfs) this one.
  return: Fiber | null

  // Singly Linked List Tree Structure.
  child: Fiber | null
  sibling: Fiber | null
  index: number

  // The ref last used to attach this node.
  ref: null | (((handle: any) => void) & { _stringRef?: string }) | RefObject
  refCleanup: null | (() => void)

  // The data coming into process this fiber.
  pendingProps: any
  // The props used to create the output.
  memoizedProps: any

  // A struct to manage updates, like state updates and callbacks such as passive effects.
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
  flags: Flags
  subtreeFlags: Flags
  deletions: Array<Fiber> | null

  // Priority level of this fiber.
  lanes: Lanes
  // Priority level of the subtree.
  childLanes: Lanes

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually has **a pair**. There are cases when we can clean up pairs to save
  // memory if we need to.
  alternate: Fiber | null
}
```

### Hooks

`Hook`s are stored as a linked list on the `memoizedState` field of a Function Component's `Fiber`.

```ts
interface Hook {
  memoizedState: any // The current state it holds
  baseState: any // The initial state or the base state from which updates are derived
  queue: UpdateQueue | null // An object to manage updates
  baseQueue: UpdateQueue | null // An object to manage rebase updates
  next: Hook | null // Form a linked list
}
```

### UpdateQueue

An `UpdateQueue` is an object that manages updates for a `Hook`.

```ts
interface UpdateQueue<S, A> {
  pending: Update<S, A> | null
  lanes: Lanes
  /** The `dispatch` function is **stable** across the component lifetime. */
  dispatch: (A => any) | null
  lastRenderedReducer: ((S, A) => S) | null
  lastRenderedState: S | null
}
```

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
