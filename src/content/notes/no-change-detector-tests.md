---
title: No Change-Detector Tests
description: Readings
lang: en
pubDate: 2026-11-14T01:00:00+08:00
category: note
---

> While listening to "Good Love Dies" by Chance Peña.

See:
- [Google Testing Blog: Testing on the Toilet: Change-Detector Tests Considered Harmful](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html)
- [Google Testing Blog: Introducing "Testing on the Toilet"](https://testing.googleblog.com/2007/01/introducing-testing-on-toilet.html)

## What were tests originally for?

Tests are the safety net that protects you when you need to **refactor** your code, or when another developer **adds features** (regression).

Tests can also help with the design of your code.

## What are Change-Detector Tests?

Tests that act like a *checksum* rather than actually testing the functionality, which will break in response to any change to the production code, without verifying correct behavior of either the original or modified production code.

## Why is it harmful?

Change-detector tests do harm rather than good because:

1. the tests do not catch any defects
2. the added maintenance cost slows down development (the work loop)

## Example (really?)

Wished for a change-detector test:

```rs
/// a goddamn good piece of code
fn smallest(nums: &mut [i32]) -> Option<i32> {
  nums.sort();
  nums.first().copied()
}

#[test]
fn test_smallest() {
  let mut nums = [4, 1, 3, 2];
  smallest(&mut nums);

  assert_eq!(nums, [1, 2, 3, 4]); // look what u made me do
  assert_eq!(smallest(&mut nums), Some(1)); // do this instead
}
```

## Some thoughts

I repeat myself quite a lot these days yelling “no change-detector tests!” to my agents (plus no AI slop `.md` files). I might should put this to my root `AGENTS.md`, or am I simply enjoying this remained feeling as a pervert for participation?
