---
title: Detect Client Environment with React
pubDate: 2025-06-23T09:00:00+08:00
description: Internals of `useIsClient`
lang: en
---

I often get confused about which React hooks are available in server components versus client components, especially since it's easy for me to mix up with traditional SSR patterns.

Here's the implementation of a [`useIsClient`](https://github.com/uidotdev/usehooks/blob/main/index.js#L543) hook as a reminder: `useEffect` is used detect client-side rendering, then it must be a client hook.

```ts
function useIsClient() {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
```
