# preload-it

A small browser library for preloading assets with composite progress events.

## Installation

```sh
npm install preload-it
```

```js
import Preload from 'preload-it'

const preload = Preload({
  stepped: true,
  timeout: 30_000,
  concurrency: 4
})

preload.onprogress = ({ progress, item }) => {
  console.log(`${progress}%`, item.url)
}

preload.onerror = item => {
  console.error(item.url, item.failureReason, item.status)
}

const items = await preload.fetch([
  '/images/cover.jpg',
  '/video/trailer.mp4'
])
```

The package also provides UMD bundles for direct browser use:

```html
<script src="https://unpkg.com/preload-it@2/dist/preload-it.min.js"></script>
```

## API

### `Preload(options)`

Creates a preloader instance. `stepped` defaults to `true`, giving every asset equal weight in aggregate progress. Set it to `false` to weight progress by bytes when response sizes are available. `timeout` is an optional XHR timeout in milliseconds and defaults to `0` (disabled).

`concurrency` is an optional positive integer that limits simultaneous requests. It defaults to unlimited concurrency, preserving the behavior of previous releases. Queued items are included in `state` immediately and are marked as cancelled if `cancel()` runs before they start.

### `fetch(urls)`

Starts one batch and resolves with all item results after every request settles. HTTP and network failures do not reject the batch; they call `onerror` and appear in the resolved array with `error: true` and a `failureReason`.

Each instance supports one active batch at a time. Starting an overlapping batch rejects with a usage error. A later, sequential call is supported and replaces `state` with the new batch.

### Callbacks

- `onprogress({ progress, item })` runs when aggregate progress changes.
- `onfetched(item)` runs when an individual non-cancelled request settles.
- `onerror(item)` runs for HTTP, network, and timeout failures.
- `oncomplete(items)` runs after a non-cancelled batch settles.
- `oncancel(items)` runs after a cancelled batch settles.

The lowercase callback names are retained for compatibility.

### `cancel()`

Aborts the active batch. Aborted items have `status: 0`, `canceled: true`, and `failureReason: 'abort'`. The batch Promise resolves with its current items; `oncancel` runs instead of `oncomplete`.

### `dispose()`

Cancels active work and revokes all object URLs created by the instance. Call it when the loaded assets are no longer needed. Repeated calls are safe.

```js
preload.dispose()
```

## Result items

Every item contains `url`, `completion`, `downloaded`, `total`, `error`, and `canceled`. Settled items may also contain `status`, `fileName`, `type`, `size`, `blobUrl`, and `failureReason` (`http`, `network`, `timeout`, or `abort`). TypeScript declarations are included.

## Browser support

The automated suite runs in current Chromium, Firefox, and WebKit releases.

## License

[MIT](LICENSE)
