---
title: Mock File Response with MSW
pubDate: 2025-03-17
keywords: ['msw', 'mock']
description: How to mock file response with MSW.
lang: en
---

I've been using [MSW](https://mswjs.io) since 2023, and it's been a great experience. Most of the time, though, I was just mocking straightforward REST APIs - JSON in, JSON out, nothing fancy.

Recently, I started working on a feature that involves a file endpoint. As usual, I began by prototyping and needed a mock API to simulate the flow.

Before diving into any hyper-tooling rabbit holes, I want to acknowledge that MSW is a solid, mature library - and yes, it absolutely provides the right APIs for this kind of use case.

In the [responding-with-binary-data](https://mswjs.io/docs/recipes/responding-with-binary-data) guide, it explains that the simplest way to obtain a buffer **in the browser** is by **fetching** the resource and using `response.arrayBuffer()` to read the body.

That was a lightbulb moment for me - especially since I was just starting to puzzle over how to use `fs.readFile()` in a module that's going to run in a service worker.

So, I copied a random file from my machine to the `mocks` folder and simply fetched it inside my handler. Done and dusted.

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
