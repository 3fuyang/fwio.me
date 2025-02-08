---
title: Type Checking in Monorepo
description: How to do type checking in a monorepo?
lang: en
pubDate: 2025-01-25T18:00:00+08:00
---

## The Problem

In a TypeScript monorepo, how can we perform type checking across sub-projects without building them? This is especially relevant in scenarios like CI pipelines, which is one of my own, where build output is unnecessary overhead.

## Solutions

### Relative Imports

As a naive way to reference code, direct module imports, a.k.a. relative imports, just works.

```ts
import { foo } from '../../packages/some-package'
```

However, it harms the essence of monorepo:

- Maintainability - Imports are coupled to the folder structure, which makes writing and refactoring them both painful. This DX downgrade is against the philosophy of monorepo, which is all about decoupling.
- Performance - TypeScript treats the monorepo as a monolithic one and does the compilation on TypeScript level instead of project level.

### Path Aliases

To my surprise, path aliases has been [the default strategy in Nx](https://nx.dev/concepts/typescript-project-linking#typescript-project-linking) for a long time until package manager workspaces come out and are supported by Nx.

```json
{
  "compilerOptions": {
    "baseUrl": ".", // Not required to be set when using `paths` since TypeScript 4.1
    "paths": {
      "@sample/*": ["../../packages/*"]
    }
  }
}
```

With the specified alias, we can reference other projects just like importing external packages.

> However, path aliases tell TypeScript to not treat the import statement **as a module to be resolved**, but rather use the key of '@sample/some-package' as a reference to where the module is located. TypeScript does not actually replace the import path during compilation. See https://monorepo.tools/typescript#mapping-to-a-path.

As a result, we need to tweak our toolings to make the import statement work seamlessly at runtime, i.e. with plugins like `vite-tsconfig-paths` or `tsconfig-paths-webpack-plugin`. Also, the code of different projects is **not really isolated** as those in a monorepo should be, restricting the type checking at TypeScript level again, which eliminates possible performance gain.

### Internal Packages

This is a strategy mentioned by [Turborepo](https://turbo.build/blog/you-might-not-need-typescript-project-references#internal-typescript-packages):

An "internal package" is a TypeScript package without a `tsconfig.json` with both its `types` and `main` fields in its `package.json` pointing to the package's **untranspiled** entry point (e.g. `./src/index.tsx`).

```json
{
  "name": "@sample/some-internal-package",
  "main": "./src/index.ts",
  "types": "./src/index.ts", // pointing to untranspiled entry file
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```

This way, the consuming application takes the responsibility of transpiling and checking the internal package.

It is a quick win because you don't need extra setup and are free to move forward immediately with other stuff, but it's not a good long-term solution:

- Not publishable - We cannot publish packages directly with its `packages.json` pointing to untranspiled source files, which does not exist in the distribution.
- Performance - Just like the two strategies above, the consuming application treats the internal package as yet another folder, and the transpilation could become a bottleneck as the project grows.

That said, for internal packages that you would never want to publish, this is very practical and definitely the most simple approach.

### Project References

[Project references](https://www.typescriptlang.org/docs/handbook/project-references.html) is the native way provided by TypeScript to reference types across projects.

Specifying `references` in `tsconfig.json` informs the TypeScript compiler about other projects nested in the current one, thus enabling the compiler to treat them as isolated pieces of code. This project-level isolation helps the TypeScript compiler to optimize type checking with parallel and incremental processing.

```json
// apps/some-app/tsconfig.json
{
  "references": [
    { "path": "../packages/some-package" },
    { "path": "../packages/another-package" }
  ]
}
```

With project references, importing modules from referenced projects would import their output declaration files(`.d.ts`) instead, without touching any of its source code, so no build is required.

Project references has its own drawbacks:

1. You need to run the TypeScript compiler against referenced projects first.
2. Mental burden of maintaining the `references` field.

For the first problem, the TypeScript compiler provides `tsc -b` command which compiles the project in **build mode**. This will automatically figure out the dependency graph and compile referenced projects **on demand**. For convenience, you can put this command into the `prepare` or other npm scripts accordingly.

And for the second one, monorepo tools could handle the process automatically for you.

To get better editor experience, it is recommended to declare all the referenced projects in the root-level TypeScript config, which allows the editor to correctly find all the available projects in your monorepo, while this is not required for simply running `tsc`.

```json
// /tsconfig.json
{
  "references": [
    { "path": "../packages/some-package" },
    { "path": "../packages/some-other-package" }
    // ...
  ]
}
```

> However, this approach is recommended by [Nx](https://nx.dev/concepts/typescript-project-linking#typescript-project-references-performance-benefits), but not by the [Turborepo](https://turbo.build/repo/docs/guides/tools/typescript#you-likely-dont-need-typescript-project-references) guys.

### Built Packages

Although our pre-assumption was type checking without building, pre-built projects is still a very practical solution since there's no additional overhead mentioned above except an extra build step is required before you can use these packages. To address this, monorepo tools like Nx/Turporepo can help improve the process via automatic building and caching the dependencies for you.

## Comparison Table

| Approach           | Setup Complexity | Performance Scalability | Publishable | Maintainability |
| ------------------ | ---------------- | ----------------------- | ----------- | --------------- |
| Relative Imports   | Low              | Poor                    | ✅          | Low             |
| Path Aliases       | Medium           | Poor                    | ✅          | Medium          |
| Internal Packages  | Low              | Poor                    | ❌          | High            |
| Project References | High\*           | High                    | ✅          | Medium          |
| Built Packages     | Low              | High\*                  | ✅          | High            |

\*With monorepo tools like Turborepo/Nx.

## Wrapping Up

The solutions, after all, are certain tradeoffs between the two orthogonal dimensions of our project - types and runtime, each of which could run on its own. To determine which approach to adopt, here are my personal thoughts:

1. For moderate or large monorepo projects, use Turborepo/Nx or other monorepo management tools from the very beginning, and stick to its recommended practice.
2. For smaller ones:
   1. Use internal packages if the consuming application can transpile referenced projects without extra configuration and the referenced packages are for internal usage only.
   2. Use path aliases for simplicity.
   3. Switch to project reference or built packages according to your need when the build time becomes noticeable.

And relative imports? Please, just forget about it.

## References

- [The Dilemma of TypeScript in Monorepos](https://www.youtube.com/watch?v=RRsttfhg1sA)
- [Managing TypeScript Packages in Monorepos](https://nx.dev/blog/managing-ts-packages-in-monorepos)
- [Monorepo Explained | TypeScript](https://monorepo.tools/typescript)
