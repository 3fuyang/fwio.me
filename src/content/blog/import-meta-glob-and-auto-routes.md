---
title: 借助 `import.meta.glob` 编写自动路由脚本
pubDate: 2022-10-07T16:20:00+08:00
description: Flog 是一个重运行时的博客应用，为了在功能上实现像 VitePress、Next.js 等 SSG 框架那样的基于文件系统的路由，使用 Vite 自带的 import.meta.glob API 实现了一个轻量级的、运行时的自动路由脚本。
lang: zh
---

> 脚本源码：[auto-routes.ts](https://github.com/3fuyang/3fuyang.github.io/blob/master/src/routes/auto-routes.ts)

## 背景

自动路由，也就是自动读取**指定目录**下的文件，为它们生成**指定环境**下的路由对象的功能。

Flog（即这个网站）一开始是借助 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) 这样一个**集成**插件来实现自动路由的。
为了写 [Flog 与 SSG](https://3fuyang.github.io/blog/ssg-in-flog#自动路由) 这篇博客，我去查阅了一些 SSG 框架的文档，其中在 [VitePress](https://vitepress.vuejs.org/)
的官方文档中得知其自动路由是**仅通过一个脚本**实现的。

![VitePress 的路由方案](../../assets//import-meta-glob-and-auto-routes/flog-and-ssg.webp)

当然，VitePress 想强调的是它**没有使用** Vue Router 这样集成的依赖，而是通过**原生**的 history 对象或其他 API 实现了更为**轻量级**的路由。
但我从这里受到的启发是，我也可以编写一个脚本，在不使用`vite-plugin-pages`这样的集成插件的前提下，去自动地生成路由。

项目中，这个脚本的基本**需求**是：

- 读取`pages`目录下的所有`.mdx`和`.tsx`文件。
- 从文件对象中取得文件路径和其导出的 React 组件。
- 根据目录**路径**和组件对象，将它们转换成一个可以由`useRoute()`调用的路由对象数组（Array\<RouteObject\>）。

这个脚本主要由两个功能构成：

1. **读取指定目录文件**：Vite 为资源加载提供了 [import.meta.glob](https://vitejs.dev/guide/features.html#glob-import) API，只需为其提供目标文件的`glob pattern`,
   它就能读取符合条件的文件，如果目标是 JS 文件，更能将其作为 ES Module 解析获取其`export`。
2. **从文件到路由**：`import.meta.glob`所返回的文件结构是**扁平**（flat）的，我们需要将其转化成 RouteObject 这样的**树形结构**（`children?: RouteObject[]`）。

第一点通过`import.meta.glob`可以很轻松地解决，那么主要的难点好像就成了一道算法题，如何将**数组转化为树**？

## 将数组转为树

用外部变量`result: RouteObject[]`存储最终结果，算法主要用到栈的思想，大致思路如下：
<br/>

1. 根据文件路径`path`，将组件数组（`{ element: FC, path: string}[]`）**排序**（`import.meta.glob`返回的结果已是有序）；
2. 在循环外，使用一个外部**栈型**变量`currDirs`记录上一个已处理组件的**父路由**（即包含`children`属性的路由）；
3. 遍历文件数组：
   1. 对每一个文件，用其`path`从前往后匹配`currDirs`，记录最大匹配索引：
      - 匹配成功：不作特殊处理;
      - 部分匹配或匹配失败：将`currDirs`栈顶层匹配失败的路由对象出栈，如果`currDirs`被**清空**，将其**栈底**元素推入`result`中。
   2. 根据该文件的`path`继续（重新）构建`currDirs`;
   3. 为文件生成`RouteObject`，推入栈顶父路由的`children`中。

## 打包体积对比

Before:

![Before](../../assets/import-meta-glob-and-auto-routes/before.webp)

After:

![After](../../assets/import-meta-glob-and-auto-routes/after.webp)

可以看到，移除`vite-plugin-pages`后，应用的打包体积优化了整整...**64 KB**！
