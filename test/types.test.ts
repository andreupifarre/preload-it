import Preload, { type PreloadItem, type ProgressEvent } from 'preload-it'

const preload = Preload({ stepped: false, timeout: 1_000, concurrency: 4 })

preload.onprogress = (event: ProgressEvent) => console.log(event.progress)
preload.onerror = (item: PreloadItem) => console.log(item.failureReason)
preload.oncancel = items => console.log(items.length)

void preload.fetch(['/asset.png']).then(items => items[0]?.blobUrl)
preload.cancel()
preload.dispose()
