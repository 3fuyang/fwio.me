---
title: 客户端 Session Storage 的生命周期
pubDate: 2022-09-30T21:33:00+08:00
description: Session Storage 是一种 Web Client Storage，本文通过试验对其生命周期进行一些探讨
lang: zh
---

> Long may the holiday shine.

最近实习分到一个在 Web 端嵌入 h5 页面的需求，具体实现中是以“跳转”（操纵`window.location`）的方式嵌入。

因为涉及到鉴权（authentication）的问题，所以仔细研究了一下 session storage 在一个 tab 页范围内跳转的生命周期，结论如下：

Session storage 一般被理解为**会话**期存储，只要对应 tab 页不关闭就会持续存在，即便使用`window.location`跳转到其他站点，
通过`window.history`接口或者重新赋值`window.location.href`回到该站点，session storage **依然存在**。

注意，打开一个**新 tab 页**进入到该站点时，是无法访问其他同源 tab 页创建的 session storage 的。
