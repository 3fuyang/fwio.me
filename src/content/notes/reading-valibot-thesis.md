---
title: Reading Valibot Thesis
description: Notes on reading the Valibot thesis.
lang: en
pubDate: 2025-03-20T20:00:00+08:00
---

Quick notes on things I found interesting or useful in the [Valibot](https://valibot.dev) thesis "Implementation of a modular schema library in TypeScript with focus on bundle size and performance".

Thesis Source: <https://valibot.dev/thesis.pdf>

## Chapter 1. Introduction

- Impressive growth rate of Zod: 525% in 12 months.
- The way Zod is written (OOP, builder pattern, etc.) is not suitable for tree-shaking, causing a bundle size issue.
- The primary goal of Valibot is to reduce the bundle size.

## Chapter 2. Fundamentals

- Common use cases of schema validation:
  - Server Requests
  - [Browser State](https://valibot.dev/guides/use-cases#browser-state), like search parameters, cookies, client storage, etc.
  - Form Validation
  - Config Files
  - ...
- An interesting mental model for bundle size optimization:
  - Tree Shaking
  - Code Splitting
  - Minification
  - Compression

## Chapter 3. Research

- Repeated patterns increase the compression rate.
- Object spread operator could cause exponential increase in validation time.
- Throwing unnecessary internal `Error` objects causes overhead since they captures additional information.

## Chapter 4. Results

This part describes part of the design of Valibot and some comparisons with other existing libraries.

At initialization:

- Valibot `schema`s only return objects containing metadata and an internal `_parse` function.
  - ```ts
    export type BaseSchema<TInput = any, TOutput = TInput> = {
      async: false
      _parse(input: unknown, info?: ParseInfo): _ParseResult<TOutput>
      _types?: { input: TInput; output: TOutput }
    }
    ```
- And `action`s return a closure which captures the passed requirements and have the same signature with `schema`s.

At validation:

- Validation entries: `parse`, `safeParse` of `is` using a schema.
- `_parse` is called with the input value and finally returns a discriminated union of the result or the error.

## Chapter 5. Conclusion

Improvements:

- Tree shakable because of modular design.
- Bundle size: 55% of Zod's size.
- Performance:
  - Initialization: 5% of Zod's time.
  - Validation:
    - Successful validation: 55% of Zod's time.
    - Erroneous validation: 49% of Zod's time.

Worse parts:

- Tooling: Needs IDE extensions for better developer experience.
