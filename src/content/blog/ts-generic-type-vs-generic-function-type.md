---
title: 'TypeScript: Generic Type vs. Generic Function Type'
pubDate: 2025-06-03T22:00:00.000+08:00
keywords: ['typescript', 'generics']
description: Understanding the subtle but important difference between generic types and generic function types in TypeScript.
lang: en
---

I recently dug into [Jotai](https://jotai.org)'s codebase to get a better grasp of the "_flourish_" and "_energetic_" modern state management. However, instead of any classic React rabbit hole that I expected, what tripped me up first was a slight but subtle distinction of the following two type definitions:

```ts
// Generic Type
type GenericHello<Value> = () => Value

// Generic Function Type
type Hello = <Value>() => Value
```

They look different, and surprisingly they **are different**! (Yeah, I know, I swear I didn't make a typo.)

At first glance, both seem like generic function types. But there's a crucial distinction: the first defines a **generic type** for a **non-generic function**, while the second defines a **non-generic type alias** for a **generic function** (a bit reversed, yeah). In other words, the second one isn't even a generic type!

```ts
// Generic Function Type
type Hello = <Value>() => Value

const hello: Hello<string> = () => 'hello'
// --> Error: Type 'Read' is not generic.

// But the function implementing the type is generic!
const hello_: Hello = <T>() => {
  return null as any as T
}

const str = hello_<string>() // ✅ string
const num = hello_<number>() // ✅ number
```

Even though we can't pass type parameters to `Hello` itself, sometimes this pattern is still very useful — as I noticed in the Jotai source code:

```ts
type Getter = <Value>(atom: Atom<Value>) => Value

type Read<Value> = (get: Getter) => Value
```

Notice the `get` function passed to `Read`? The generic function type of `Getter` is perfect here, since `get` needs to read **any** atom value. Without this self-contained pattern, we would end up sprinkling `as` casts everywhere for such a simple API design!

So next time you're writing a function type and debating where to put the type parameters — take a second. The choice might be more meaningful than it looks.

> Honestly, I hadn't read the TypeScript docs in a while — mostly because I personally doubt if they are really maintaining it rather that those productive release notes. But to their credit, this slight difference is also mentioned by [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables):
>
> > Instead of describing a generic function, we now have a non-generic function signature that is a part of a generic type.
