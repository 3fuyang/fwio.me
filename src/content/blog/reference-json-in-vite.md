---
title: Referencing JSON in Vite
pubDate: 2025-01-03T22:42:00.000+08:00
keywords: ['preload', 'web performance', 'vite', 'json']
description: How to import your JSON files properly in Vite.
lang: en
---

## Two Approaches

**JSON**, as the standard format of **structured data** in web development, basically has two approaches to be consumed in [Vite](https://vite.dev):

- JS Module
- Static Asset

### JSON as JS Module

This way, like the [JSON modules](https://nodejs.org/docs/latest/api/esm.html#json-modules) in Node, parses the JSON and load the object directly into our module.

In comparison to the default-only import in Node, Vite even allows [named imports](https://vite.dev/config/shared-options.html#json-namedexports) for each **top-level property** in the JSON object, which helps with tree-shaking.

```ts
// JSON module in Node

// JSON module in Vite
import { baz } from './bar.json'
import foo from './foo.json' with { type: 'json' }

console.log(foo)

console.log(baz)
```

Under the hood, Vite converts `.json` files to ES6 modules via:

- esbuild built-in [JSON loader](https://esbuild.github.io/content-types/#json) in dev server
- [`@rollup/plugin-json`](https://github.com/vitejs/vite/blob/main/packages/vite/rollup.config.ts#L6) at build time

In this approach, JSON files are treated as JS modules and will be included when bundled, just like any other JS files.

### JSON as Static Asset

Meanwhile, JSON files can be treated as static assets, which are served as separated files and should be referenced by the resolved public URL.

The static asset URL differs by the parent directory of the JSON file in Vite:

- [**Public directory**](https://vite.dev/guide/assets.html#the-public-directory): URL stays unchanged
- **Non-public directory**: URL will be suffixed with the **file hash**

And for JSON files, you need to use the [`?url`](https://vite.dev/guide/assets.html#explicit-url-imports) or [`?raw`](https://vite.dev/guide/assets.html#importing-asset-as-string) suffix to bypass the JSON loader, since Vite does not [recognize](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts#L121) JSON as assets by default.

```ts
// Public directory
// stays `/foo.json`
import foo from '/foo.json?url'

// Non-public directory
// becomes `/assets/foo.2d8efhg.json`
import foo from './foo.json?url'
```

To utilize static JSON assets, you typically need to fetch and parse them at runtime.

```ts
const foo = await fetch('/foo.json').then((res) => res.json())
```

## Which One to Choose?

Most of the time, I personally go with the [JSON as module](#json-as-js-module) approach for simplicity. But of course, it always depends on the use case.

In my opinion, the usage of JSON in frontend development usually **scales** from module to assets.

It tends to start as an abstraction of static data for better separation of concerns. For example, a table-of-contents configuration for a documentation site. The configuration is often **unique** and **critical at the build time** to the project, so importing this file as a module meets the requirement quite well and is very intuitive.

```tsx
import toc from './toc.json'

// UI for navigation

;<TOC toc={toc} />

// RSS feed
await writeFile('rss.xml', generateRSSFeed(toc))

// Other usages...
```

But things change when it comes to more scalable and dynamic scenarios. A typical example of this is **dynamic configurations**, for which I found [Shiki's theme preview](https://shiki.style/themes) is a great example.

[Shiki](https://shiki.style/) is a syntax highlighter library, and its [playground](https://textmate-grammars-themes.netlify.app/) supports preview of different themes, which are written in [JSON files](https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes/themes).

In the playground, multiple JSON files may be needed as the user wants to preview different themes, and the files acquire quite some bandwidth. In this case, it's better to keep different configurations in **separated** JSON files and load them **on demand**.

```ts
function loadTheme(name: string) {
  return fetch(`/themes/${name}.json`).then((res) => res.json())
}
```

However, your JSON asset is not always located in the public directory, chances are you want to colocate it with your app code. To [resolve the proper URL](https://vite.dev/guide/assets.html#new-url-url-import-meta-url), you will need to construct the URL with `import.meta.url`.

```ts
function loadTheme(name: string) {
  const url = new URL(`./themes/${name}.json`, import.meta.url).href
  return fetch(url).then((res) => res.json())
}
```

This way, we avoid the bundle size exploding with huge amounts of JSONs and can dynamically access them, which is similar with accessing database with REST APIs.

## Preload JSON Assets

Like any other static assets, JSON files could be huge thus harms the use experience when loading.

For resources that your page will need very soon, the [`rel=preload`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) primitive is great for improving the loading performance.

As we will load JSON assets via `fetch`, we need to specify the correct `as` attribute. In addition to this, proper `crossorigin` attribute is also required for the preloaded resource to be accessible to our `fetch` calls.

```html
<link rel="preload" as="fetch" src="/foo.json" crossorigin />
```

This way, the JSON file will be preloaded and often immediately available for the first `fetch` call when the interaction happens. But in real scenarios, you may want to provide more granular **cache strategies** for the asset, i.e. `stale-while-revalidate`, according to your specific use case.
