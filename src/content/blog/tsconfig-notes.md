---
title: TS Config 简记
pubDate: 2022-05-02T18:03:00+08:00
description: 对 TypeScript 的 Config File 中一些字段意义的记录。
lang: zh
---

> 总结一些 TSConfig 文件的选项意义。

- 一个 TSConfig 文件表示其所在目录是 TypeScript 或 JavaScript 项目的**根目录**。

## Root Fields

### files

- 指定项目包含哪些文件。

### extends

- `extends`的值是一个包含指向要**继承**的另一个 TSConfig 文件的路径。
- 首先加载基文件 (base file) 中的配置 (即`extends`指向的文件)，然后被派生文件的配置**覆盖**。
- 配置文件中的所有相对路径都将相对于**它们所在的配置文件**进行解析。
- `references`是顶层属性中唯一不能被继承的。

### include

- 以数组指定项目要包含的文件或模式。
- `include`和`exclude`支持通配符来生成全局模式 (glob patterns)：
  - `*`：匹配零或多个字符（不包含目录间隔符）
  - `?`：匹配任意一个字符（不包含目录间隔符）
  - `**/`：匹配嵌套任意级的任意目录。

### exclude

- 以数组指定在解析`include`时，应该专门排除的文件。

### references

- `references`为数组的形式，可将 TypeScript 项目的结构组织为更小的部分。
- 使用项目引用 (references) 可以极大地缩短构建和编辑器交互的时间，强制组件之间的逻辑分离，并以改进的方式组织代码。
- 每个`reference`的`path`属性可以指向一个包含 TS Config 文件的目录。
- 当你引用一个项目时，会带来以下不同：
  - 从引用的项目导入模块，将变为加载其输出的**声明文件**(.d.ts)。
  - 如果引用的项目生成了一个 outFile，这个 outFile 的.d.ts 文件的声明会对该项目**可见**。
  - 构建模式会自动构建所需的引用项目。

## Compiler Options

### baseUrl

- 指定解析**非绝对模块名**所依据的根目录。
- `"baseUrl": "./"`会查找`ts.config.json`所在目录的文件。

### module

- 应该为每个项目设置`module`，表示项目所使用的模块方案。
- 改变`module`也会影响`moduleResolution`。
- `es6(es2015)`与`es2020`的主要区别是，`es2020`引入了动态`import()`和`import.meta`。

### moduleResolution

- 指定模块的**解析策略**。

### composite

### rootDir

- 所有非声明输入文件的**最长公共路径**。

- 如果设置了`composite`，则根目录的默认值为包含`tsconfig.json`文件的目录。

- 举例：

- ```xml
  MyProj
  ├── tsconfig.json
  ├── core
  │   ├── a.ts
  │   ├── b.ts
  │   ├── sub
  │   │   ├── c.ts
  ├── types.d.ts
  ```

- 其推断出的`rootDir`是最长公共路径`core/`，那么最后导出的 TypeScript 为：

- ```xml
  MyProj
  ├── dist
  │   ├── a.js
  │   ├── b.js
  │   ├── sub
  │   │   ├── c.js
  ```

### types

- 默认情况下，所有**可见**的`@types`包都会被纳入编译。
- 任何封闭文件夹内的`node_modules/@types`都被认为是可见的。
- 如果`type`被指明，则只有列出的包会被包含在全局作用域内。

### lib

- TypeScript 为内置 JS APIs 包含了一个默认集，包括浏览器环境中对象的类型定义。
- TypeScript 也包含了 JS 的新特性，比如类型`Map`的定义。

- 从 TypeScript 4.5 开始，lib 文件可以被 npm 模块覆盖。
