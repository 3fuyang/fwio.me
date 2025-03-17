---
title: Mock File Response with MSW
pubDate: 2025-03-17
keywords: ['msw', 'mock']
description: How to mock file response with MSW.
lang: en
---

I've been using MSW since 2023 and it's been a good time, but most of time I was just mocking simple REST APIs - JSON comes, JSON goes, that's it.

But recently, I'm working on a feature which involves a file endpoint. Just like it always happens, I started prototyping it, and I need an API mock to simulate the flow.

Before being trapped by any hyper-tooling investigation, I'm fully aware that MSW is a great and mature library, and of course it provides relevant APIs for my case.

In [responding-with-binary-data](https://mswjs.io/docs/recipes/responding-with-binary-data), it illustrates that the easiest way to obtain a buffer **in the browser** is to **fetch** the resource you need and read its body as `response.arrayBuffer()`.

That is very enlightening to me, especially when I was just starting to be confused about how to call `fs.readFile()` in a module which is gonna be consumed in a service worker.

So I copy paste a random file from my computer to the `mocks` folder and simply request it with `fetch` in my handler.

```ts
export const fileHandler = http.get('/files/:fileId', async () => {
  // I was working on a Vite project, so the real URL needs to be resolved with `import.meta.url.`.
  // Make sure to align with your bundler.
  const buffer = await fetch(new URL('./file.pdf', import.meta.url).href).then(
    (response) => response.arrayBuffer(),
  )

  return HttpResponse.arrayBuffer(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="file.pdf"',
    },
  })
})
```
