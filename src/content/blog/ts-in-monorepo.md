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

As a result, we need to tweak our toolings to make the import statement work seamlessly at runtime, i.e. plugins like `vite-tsconfig-paths` or `tsconfig-paths-webpack-plugin`.

And still, the type checking is at TypeScript level.

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

[Project references](https://www.typescriptlang.org/docs/handbook/project-references.html) is the native way provided by TypeScript to reference types across projects. In other words, it's a type only strategy and has nothing to do with the runtime behavior.

```json
// apps/some-app/tsconfig.json
{
  "references": [{ "path": "../packages/some-package" }]
}
```

With project references, importing modules from referenced projects would import their output declaration files(`.d.ts`) instead, without touching any of its source code. Notably, the build is scoped within each project, aka. **project-level**, which introduces the possibility of **parallel** and **incremental** type checking.

Project references has its own drawbacks:

1. You need to build the referenced project first.
2. The `references` field needs careful maintaining.

For the first problem, running `tsc -b` will compile the project in build mode, which helps you figure out the dependency graph and compile referenced projects on demand. We can put this command into our `prepare` or other scripts.

And for the second one, additional build tools like Nx could handle the process automatically for you.

Lastly, all the referenced projects need to be declared in the root-level TypeScript config to allow the editor to correctly find all the available projects in your monorepo, while this is not required for running `tsc`.

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

Remember our requirement is to perform type checking with building packages? Actually building them is not that scary but perhaps the most reliable approach. You don't need any of the setup or configurations mentioned in the approaches above and don't have to worry about publishing any of the packages. All you need is to run a `pnpm build -r` or similar commands from your preferred package manager. As for the build time, while it could explode with the complexity growing, luckily, tools like Nx and Turporepo can help improve the process via smart caching mechanisms.

## Comparison Table

| Approach           | Setup Complexity | Performance Scalability | Publishable | Maintainability |
| ------------------ | ---------------- | ----------------------- | ----------- | --------------- |
| Relative Imports   | Low              | Poor                    | ✅          | Low             |
| Path Aliases       | Medium           | Poor                    | ✅          | Medium          |
| Internal Packages  | Low              | Poor                    | ❌          | High            |
| Project References | High\*           | High                    | ✅          | Medium          |
| Built Packages     | Low              | High\*                  | ✅          | High            |

\*With build tools like Turborepo/Nx.

## Wrapping Up

The solutions, after all, are certain tradeoffs between the two rectangular dimensions of our project - types and runtime, each of which could run on its own. To determine which approach to adopt, here are some of my personal thoughts:

1. For moderate or large monorepo projects, use Turborepo/Nx or other monorepo management tools from the very beginning, and stick to its recommended practice.
2. For smaller ones:
   1. Use internal packages if the consuming application can transpile referenced projects without extra configuration and you the referenced packages are for internal usage only.
   2. Use path aliases for simplicity.
   3. Switch to project reference or built packages according to your need when the build time becomes noticeable.

And relative imports? Please, just forget about it.

## References

- [The Dilemma of TypeScript in Monorepos](https://www.youtube.com/watch?v=RRsttfhg1sA)
- [Managing TypeScript Packages in Monorepos](https://nx.dev/blog/managing-ts-packages-in-monorepos)
- [Monorepo Explained | TypeScript](https://monorepo.tools/typescript)
