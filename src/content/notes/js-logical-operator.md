---
title: JS 的 && 与 ||
pubDate: 2022-09-23T22:49:00+08:00
description: JS 逻辑运算符的短路特性。
lang: zh
---

...以前一直以为`&&`和`||`运算的结果是一个`boolean`，但今天实习的时候，看到项目里的这段代码：

```html
<foo v-for="form in formList" :key="..." v-validate="form.rules || {}"></foo>
```

自己还以为是个 bug，想改成`v-validate="form.rules ? form.rules : {}"`，但查了 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR) 后发现其描述是这样的：

> 逻辑运算符（||）**通常**与`boolean`一起使用，这时，它返回`boolean`。
> 然而，`||`实际上返回的是某个**操作数**（operand），所以完全不限于`boolean`。

自己之所以产生上面的误解，一方面是对基础掌握不扎实，一方面是自己对 JS 中双目逻辑运算符的应用场景很大程度上受到了《Vue.js 设计与实现》这本书的影响。

在《Vue.js 设计与实现》的*如何设计一个响应式系统*中，作者使用了大致如下的模式来实现一个**记录响应式状态的副作用**的需求：

```js
/**
 * map: Map<string, Set<Function>>
 * key: string
 * effectFn: (...agrs: any[]) => any*/
;(key, effectFn) => {
  // bucket of side-effect functions
  let bucket = map.get(key)

  bucket && map.set(key, (bucket = new Set([effectFn])))
}
```

这个模式深入我心，但是你可以看到，这里利用的是逻辑运算符的**短路执行特性**（Short-circuit evaluation），重点在于何时会**执行**第二个操作数语句，
而不关注整个逻辑运算表达式所返回的结果。

但总的来说，解开对逻辑运算符的这个误解还是对我帮助很大，能写出更简洁的程序不说，至少不会再**错误推断**别人的代码了...
