---
title: prototype 函数中的 this 绑定
pubDate: 2022-09-02T15:11:00+08:00
description: 你知道的，我一直是 `this` 的死党，至于 Functional Programming，我祝他成功
lang: zh
---

在重做山月前端面试基础中 [bind](https://q.shanyue.tech/fe/js/32.html) 一题时，由于对`this`理解不到位，写出如下**错误答案**：

```js
Function.prototype.myBind = (obj) => {
  return (...args) => this.apply(obj, args)
}

function f(arg) {
  console.log(this.a, arg)
}

// TypeError: this.apply is not a function
f.myBind({ a: 2 })(4)
```

> `error: TypeError` 通常表示对变量进行了**不合理的操作**。

其中，返回的箭头函数并没有问题，但`myBind`不能使用箭头函数定义，因为返回函数的`this`**继承**自外层的`myBind`,
由于`myBind`也用箭头函数定义，那么在**定义时**`this`就**静态**地指向了`Global`对象，`Global`不是一个函数，不存在`apply`属性，所以报错。

将外层的`myBind`改为常规函数 (function () \{\}) 的写法即可：

```js
Function.prototype.myBind = function (obj) {
  return (...args) => this.apply(obj, args)
}

function f(arg) {
  console.log(this.a, arg)
}

// 2, 4
f.myBind({ a: 2 })(4)
```

这样，所返回箭头函数的`this`将由`myBind()`在**运行时**确定，也正好就是实例化的**函数对象**。
