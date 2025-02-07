---
title: FE Interview Questions
description: Notes for possible interview questions.
lang: zh
pubDate: 2025-02-06T10:00:00+08:00
draft: true
---

## JavaScript

### Closure（闭包）

## HTTP

### Methods

### Status Codes

### Cache

#### No-Storage

该响应

#### Stale-While-Revalidate

**参考资料**：

- [Keeping things fresh with stale-while-revalidate](https://web.dev/articles/stale-while-revalidate)

`stale-while-revalidate` 是一种 HTTP 缓存失效策略，最初由 [RFC 5861 - HTTP Cache-Control Extensions for Stale Content](https://datatracker.ietf.org/doc/html/rfc5861) 规范化：它允许缓存**立刻返回已过期的响应**，同时在**后台**尝试**刷新**该缓存，由此**隐藏客户端与服务端之间的延迟**。

值得注意的是，新的缓存有效期将以其刷新时间作为起点，而非客户端下一次请求的时间。

**作用**：平衡数据展示的**即时性（immediacy）**与**时效性（freshness）**

**例子**：

在 HTTP 缓存策略中，`stale-while-revalidate` 通常与 `max-age` 一起使用：

```http
Cache-Control: max-age=600, stale-while-revalidate=30
```

在该响应头中，`max-age=600` 说明新响应的数据时效为 600s，`stale-while-revalidate=30` 表示当缓存过期后 30s 内，将直接返回过期数据，同时在后台试图刷新数据。若下一次请求时已超出 `stale-while-revalidate` 的时间窗口，那么请求将忽视缓存，进行常规的、阻塞式的请求。

**安全考虑**：

[规范](https://datatracker.ietf.org/doc/html/rfc5861#section-5)中提到，由于 `stale-while-revalidate` 中的 revalidation 过程是由缓存层于后台发起，而不是直接由客户端或用户发起的，因此需要向源服务器（Origin server）提供一种完全控制（dictate）是否应该直接提供过期响应的机制，否则存在服务被放大攻击（Amplification attacks）的风险。

至于何时产生并非直接由用户或客户端发起的请求，需要各缓存的实现自行决断。

**兼容性**：

值得一提的是，`stale-while-revalidate` 作为 HTTP 缓存控制指令在现代浏览器中的[兼容性](https://caniuse.com/mdn-http_headers_cache-control_stale-while-revalidate)已经较好，尤其是在 Safari 14 中已经得到支持。

**适宜场景**：

`stale-while-revalidate` 适用于数据**需要时效性**，但也能**容忍一定程度过期**的场景。在常规的 Web 应用中，介于纯静态与高频更新且时效性要求极高之间的状态，理论上均可使用 `stale-while-revalidate` 管理缓存时效。然而，针对应用中每个 API 都设计相应的 `max-age` 与 `stale-while-revalidate` 几乎不可能，因此，实践中（例如 `@tanstack/query`、`swr`）可以默认假定所有响应均立刻过期（`max-age=0`），同时永远优先返回缓存（`stale-while-revalidate=Infinity`）。
