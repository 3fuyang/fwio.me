---
title: TS 中的函数重载
pubDate: 2022-09-12T22:06:00+08:00
description: TypeScript 所定义的函数重载语法，与 C++ 等静态语言中的概念有较大差异。
lang: zh
---

TypeScript 中的函数重载（Function Overload）较为特别，其允许的是**声明**（Declaration）重载，而不是**实现**（Implementation）重载。

意即，不论在声明中对函数重载多少次，也仅允许有**唯一一个**实现，且这种实现必须**兼容**所有声明。

这可以从各重载的**返回值**必须**相同**看出，
因为 JavaScript 的函数调用时的**参数**（arguments）处理就是粗暴的**数组传递**，所以函数的**签名**就完全由**返回值**确定。

所以 TS 中函数重载的意义主要在于，使 IDE 能够提供**函数重载**这种思维模式的**代码提示**。

完全符合 TypeScript 作为 JavaScript 的**注释**的角色，除了`class`和`enum`外不具备任何**运行时**功能。
