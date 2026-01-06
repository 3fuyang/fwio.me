---
title: Stream Response
description: draft
lang: en
pubDate: 2024-05-29T17:59:00+08:00
draft: true
---

## Typical data flow in the web

> HTTP responses typically send the **entire** payload to the client all at once. This approach can sometimes result in a slow user experience if the data is large or computationally intense.

In a `computation --> response --> consume` pipeline, being intrinsically too large blocks the `response` stage, while computationally intense blocks the `computation` stage. Both cases result in a slow user experience: "The response arrives so late".

## Breaking data to chunks

The [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) enables developers to stream chunks of the payload as they become available, delivering content in an incremental fashion.

> Browsers already do this whn receiving media assets — video buffers and play as more of the content downloads, and sometimes you'll see images display gradually as more is loaded too.

A [**chunk**](https://streams.spec.whatwg.org/#model) is a single piece of data that is written to or read from a stream, which could be of any type such as `String` for text of `Uint8Array` for binary files. A particular stream can also contain chunks of different types. A chunk will often **not be the most atomic unit** of data for a given stream; for example, a byte stream might contain chunks consisting of 16KiB `Unit8Array`s, instead of single bytes.

Small chunks of data are emitted and processed **early** by the consumer, instead of buffering it all into memory and process it **in one go**.

### Readable Streams

A `ReadableStream` represents an _underlying source_ from which data is consumed.

Typically, `ReadableStream`s effectively operate in one of two modes: flowing(Push sources) and paused(Pull sources).

- In flowing mode, data is read from the underlying source automatically and provided to an application as quickly as possible using various events. An example is reading from a TCP socket, where data is constantly being pushed from the OS level, at a rate that can be controlled by changing the TCP window size.

- In paused mode, the application must explicitly call the interface to read chunks of data from the stream. The data may be available synchronously, e.g. if held by ths OS's in-memory buffers, or asynchronously, e.g. if needs to be read from disk. Examples include a file handle or a `fetch()` request.

The data is read sequentially in small chunks, while the unread ones are kept track of by an **internal queue** of the stream.

There is a `controller` construct that allows the stream to be controlled, for example, to cancel it. Each stream can be accessed by only one **reader** at a time, we say the stream is **locked** by the reader. The reader must be canceled before the stream being read by another one.

According to [Processing Data Chunks](https://vercel.com/guides/processing-data-chunks#transform-the-stream's-data-chunks), we create a `ReadableStream` with `TextEncoder`.

```ts
// TextEncoder objects turn text content
// into streams of UTF-8 characters
const encoder = new TextEncoder()

// Readable stream object, which clients read from
const readableStream = new ReadableStream({
  // Add the stream's content
  start(controller) {
    const text = 'Stream me!'

    // Enqueue the text to the stream
    controller.enqueue(encoder.encode(text))

    // Prevent any writing to the stream
    controller.close()
  },
})
```

In the example above, we created a `ReadableStream` that emits a single chunk of data, which is a UTF-encoded `Uint8Array` object.

### Transform the stream's data chunks

```ts
const decoder = new TextDecoder()

const transformStream = new TransformStream({
  transform(chunk, controller) {
    // Decode the chunk, into a `string`
    const text = decoder.decode(chunk)

    // Make the text uppercase,
    // encode it and add it back to the stream
    controller.enqueue(encoder.encode(text.toUpperCase()))
  },
})
```

### Stream the data chunk by chunk

Finally, we stream the data chunk by chunk as a web response.

```ts
// Send the streamed response
return new Response(readableStream.pipeThrough(transformStream), {
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
  },
})
```

## Use cases

Here's some use cases from [Streams Standard](https://streams.spec.whatwg.org/):

- Video effects: piping a readable video stream through a transform stream that applies effects in real time.

- Decompression: piping a file stream through a transform stream that selectively decompress files from a `.tgz` archive, turing them into `img` elements as the user scrolls through an image gallery.

- Image decoding: piping an HTTP response stream through a transform stream that decodes bytes into bitmap data, and then through another transform that translates bitmaps into PNGs. If installed inside the `fetch` hook of a service worker, this would allow developers to transparently polyfill new image formats.

- ...

## Reference

- https://vercel.com/docs/functions/streaming
- https://vercel.com/guides/handling-backpressure
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- https://en.wikipedia.org/wiki/Chunked_transfer_encoding
- https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts
