---
title: Promise/A+ 规范
pubDate: 2022-10-03T20:56:00.000+08:00
description: 翻译 Promise/A+ Specification
lang: zh
---

> I reprint this article in Chinese, just like Prettier.
>
> Reference:
>
> - [Promises/A+](https://promisesaplus.com/)

## 1. Terminology

1. "promise" 是一个对象或者函数，其 `then` 方法的实现与该规范一致。
2. "thenable" 是一个定义了 `then` 方法的对象或者函数。
   > **注意**：在 ECMAScript 规范中，只要一个对象**定义**了 `then` 方法，**无论实现如何**，都被认为实现了 `Thenable` 接口。
3. "value" 是任意 JavaScript 值（包含 `undefined`，`thenable` 或 `promise`）。
4. "exception" 是一个由 `throw` 语句抛出的值。
5. "reason" 是解释一个 promise 变为 rejected 的原因。

## 2. Requirements

### 2.1 Promise States

一个 Promise 必须是以下一种状态：`pending`，`fulfilled` 和 `rejected`.

1. 当处于 `pending`，promise ：
   1. 可能转变为 `fulfilled` 或 `rejected` 状态。
2. 当处于 `fulfilled`，promise ：
   1. 不能再转变为其他状态；
   2. 必须有一个结果值 `value`，且这个值不可改变。
3. 当处于 `rejected`，promise：
   1. 不能再转变为其他状态；
   2. 必须有一个原因 `reason`，且这个原因不可改变。

这里的“不可改变”即 Strict Equality，但不要求深不可变性（Deep Immutability）。

### 2.2 The `then` Method

一个 promise 必须提供一个 `then` 方法，以访问其当前或最终的结果值（`value`）或原因（`reason`）。

Promise 的 `then` 方法接收两个参数：

```js
promise.then(onFulfilled, onRejected)
```

1. `onFulfilled` 和 `onRejected` 都是**可选**参数：
   1. 如果 `onFulfilled` 不是函数，其应该被忽略；
   2. 如果 `onRejected` 不是函数，其应该被忽略。

2. 如果 `onFulfilled` 是函数：
   1. 它必须在 promise 变为 `fulfilled` 后被调用，并以 promise 的结果值（`value`）作为第一个参数；
   2. 在 promise 变为 `fulfilled` 之前不能被调用；
   3. 最多只被调用一次。

3. 如果 `onRejected` 是函数：
   1. 它必须在 promise 变为 `rejected` 后被调用，并以 promise 的理由（`reason`）作为第一个参数；
   2. 在 promise 变为 `rejected` 之前不能被调用；
   3. 最多只被调用一次。

4. `onFulfilled` 和 `onRejected` 在执行上下文栈只包含**平台代码**之前不可被调用。

> **平台代码**（Platform code）是指引擎、环境和 promise 实现代码。实际上，该要求保证 `onFulfilled` 和 `onRejected` 在调用 `then` 后被**异步**执行。这可以通过**宏任务**（Task）机制实现（比如 `setTimeout` 或 `setImmediate`），或者**微任务**（Microtask）机制（比如 `queueMicrotask` 或 `process.nextTick`）。

5. `onFulfilled` 和 `onRejected` 必须作为函数调用（没有 `this` 对象）。

6. 在同一个 promise 上，`then` 可能被多次调用。
   1. 当 promise 处于 `fulfilled` 状态，所有相关的 `onFulfilled` 必须按照其 `then` 的调用顺序执行；
   2. 当 promise 处于 `rejected` 状态，所有相关的 `onRejected` 必须按照其 `then` 的调用顺序执行。

7. `then` 必须返回一个 promise。
   1. ```js
      promise2 = promise1.then(onFulfilled, onRejected)
      ```

   2. 如果 `onFulfilled` 或 `onRejected` **返回**了一个值 `x`，`promise2` 执行 promise resolution procedure `[[Resolve]](promise2, x)`；

   3. 如果 `onFulfilled` 或 `onRejected` 抛出一个异常 `e`，`promise2` 转变为 `rejected`，其原因为`e`；

   4. 如果 `onFulfilled` 不是函数，且 `promise1` 转为了 `fulfilled`，则 `promise2` 转为 `fulfilled`，其结果值（`value`）与 `promise1` 一样；

   5. 如果 `onRejected` 不是函数，且 `promise1` 转为了 `rejected`，则 `promise2` 转为 `rejected`，其原因（`reason`）与 `promise1` 一样。

> 注意：根据具体实现的不同，`then` 方法返回的 promise 可能与原 promise 完全相等。

### 2.3 The Promise Resolution Procedure

Promise 解析流程（promise resolution procedure）是一个**抽象操作**，它接收一个 promise 和值（`value`）作为输入，记为 `[[Resolve]](promise, x)`。如果 `x` 是一个 thenable，那么在 `x` 与 promise 具有类似行为的估量下，promise 将采用 `x` 的状态。否则，promise 将以 `x` 为结果，进入 `fulfilled`。

对于 thenable 的这种处理，使得 promise 的实现可以**互操作（interoperate）**，即实现了满足 Promise/A+ 规范的 `then` 方法的对象就可以视作 promise。

运行 `[[Resolve]](promise, x)`，会执行以下步骤：

1. 如果 `promise` 和 `x` 指向同一个对象，则以 `TypeError` 作为原因 reject 该 promise；
2. 如果 `x` 是一个 promise，采用（adopt）其状态：
   1. 如果 `x` 处于 `pending`，promise 保持 `pending` 直到 `x` 状态改变；
   2. 当 `x` 转为 `fulfilled`，使 promise 以相同的值转为 `fulfilled`；
   3. 当 `x` 转为 `rejected`，使 promise 以相同的原因转为 `rejected`。
3. 否则，如果 `x` 是一个对象或函数：
   1. 声明 `then = x.then`；
   2. 如果 `x.then` 导致抛出一个异常 `e`，将 `e` 作为原因 reject `promise`；
   3. 如果 `then` 是一个函数，将 `x` 作为其 `this` 对象，传入第一个参数 `resolvePromise` 和第二个参数 `rejectPromise`，调用 `then`：
      1. 当 `resolvePromise` 以 `y` 值调用时，运行 `[[Resolve]](promise, y)`；
      2. 当 `rejectPromise` 以原因 `r` 调用时，用 `r` reject promise；
      3. 如果 `rejectPromise` 和 `resolvePromise` 都被调用，或者一者被多次调用，只取**第一次调用**的结果，并忽视后续调用；
      4. 如果调用 `then` 抛出异常 `e`：
         1. 如果 `resolvePromise` 或 `rejectPromise` 已被调用，则忽视异常；
         2. 否则，以 `e` 为原因 reject promise。
   4. 如果 `then` 不是函数，则以 `x` 为值将 promise 转为 `fulfilled`。
4. 如果 `x` 不是函数或对象，则以 `x` 为值将 promise 转为 `fulfilled`。（这里包括 `x === undefined`，即 handler 没有返回值的情况）

当上面这种实现遇到**循环引用**的 thenable 对象时，将进入无限递归，**推荐但不要求**对这种情况以 `TypeError` 为原因 reject promise。

> **注意**：规约中**并未**提到 promise 本身的**状态迁移方法**（即我们熟悉的 ECMAScript 中的 `resolve` 和 `reject`）该如何实现，
> 在 ECMAScript 中，promise 构造函数中的 `resolve` 也会对 thenable 类型的结果值进行**解包**（Unwrap）,
> 所以可以大致将上面的 `[[Resolve]](promise, x)` 视作 promise 的 `resolve` 以及 `reject` 方法**内部**需要实现的逻辑。
