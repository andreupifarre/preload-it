# Migrating from 1.x to 2.0

Most integrations require no code changes. The factory, lowercase callbacks, `fetch()` result, item fields, and browser bundle filenames remain available.

## Batch state

`state` and the array resolved by `fetch()` now contain only the latest batch. If an application relied on cumulative state, store each resolved array itself:

```js
const history = []
history.push(...await preload.fetch(firstBatch))
history.push(...await preload.fetch(secondBatch))
```

## Concurrent calls

Do not start a second `fetch()` on the same instance while one is active. Use separate instances for concurrent batches.

## Failures and cancellation

Failed assets continue to resolve as part of the batch and trigger `onerror`. Network errors and timeouts now behave like HTTP failures instead of leaving the Promise pending.

Cancelling a batch now resolves its Promise and triggers `oncancel`; it does not trigger `oncomplete`. Check `item.canceled` when distinguishing aborted items.

## Object URLs

Call `dispose()` after consumers have finished using the generated `blobUrl` values. This revokes the URLs and releases their retained data.
