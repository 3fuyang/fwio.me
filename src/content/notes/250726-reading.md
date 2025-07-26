---
title: Readings 250726
description: Readings
lang: en
pubDate: 2025-07-26T16:00:00+08:00
---

- [WebAssembly: Yes, but for What? - ACM Queue](https://queue.acm.org/detail.cfm?id=3746171) - Very rich and detailed content.
  - Couldn't agree more with the three major areas of WebAssembly:
    - **Ad-hoc composition/plug-ins** - e.g. extension system
    - Lightweight **virtualization** - e.g. dynamic but lightweight code execution
    - The **component model** - a sweeping new vision of how to compose systems from pieces
- [React Router and React Server Components: The Path Forward | Remix](https://remix.run/blog/react-router-and-react-server-components) & [React Router RSC Preview | Remix](https://remix.run/blog/rsc-preview) - Some random notes:
  - Vite does not officially support RSC yet, although there are [WIP implementations](https://github.com/hi-ogawa/vite-plugins/tree/main/packages/rsc). The React Router team is mostly exploring RSC with Parcel so far, which is the only bundler that supports RSC other than Next.js and waku.
  - The integration of RSC with React Router is called [**Server Route**](https://remix.run/blog/rsc-preview#server-component-routes), the route which won't be bundled for the client.
  - Since RSC requires bundler-level support, it's only available in Framework mode of React Router.
  - In [this part](https://remix.run/blog/rsc-preview#batching-and-caching), the team mentioned that N+1 queries and over-fetching is a major concern for the RSC architecture. The **"batching and caching"** pattern pattern developed by the GraphQL team is applied to avoid this issue.
  - An interesting design is that the cache of the data loader above lasts **as long as the request**.
  - I would like to take down the brief *"how (traditional) framework mode works"* section below:
    1. Routes are defined in `route.ts` config file (centralized)
    2. A bundler plugin reads this config and generates:
       - A **manifest** mapping routes to chunks for the browser
       - A **server entry** containing the manifest and server-side route mappings
    3. The React Router runtime uses these generated files to handle routing
