---
title: Readings 250529
description: Readings
lang: en
pubDate: 2025-05-29T21:00:00+08:00
---

- [Cascading Cache Invalidation — Philip Walton](https://philipwalton.com/articles/cascading-cache-invalidation/) - Really impressed by the "cascading cache invalidation" problem, especially for a fanatic code splitter like me.
  - For better memory, I'd like to explain the term in my own phrase: Cascading cache invalidation is the issue that updating a module causes the source code of the module referencing it to also change, which generates multiple changed filenames and thus fails the intention of code splitting with revisioned filenames for better long-term asset caching.
- [Resilient Import Maps - Better Theme Development and Beyond (2025) - Shopify](https://shopify.engineering/resilient-import-maps?ck_subscriber_id=2699399951) - It's great to see that Jake is still working on cool and platform-first stuff.
- [Building a Hold to Delete Component](https://emilkowal.ski/ui/building-a-hold-to-delete-component) - I really like the code playground component, very clean and still sharp.
