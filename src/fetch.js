function invoke(callback, value) {
	try {
		callback(value)
	} catch (error) {
		setTimeout(() => { throw error }, 0)
	}
}

export default function fetch(list) {
	if (!Array.isArray(list)) {
		return Promise.reject(new TypeError('Preload.fetch expects an array of URLs'))
	}

	if (this._activeBatch) {
		return Promise.reject(new Error('A preload batch is already in progress'))
	}

	this.state = list.map(url => ({
		url,
		completion: 0,
		downloaded: 0,
		total: 0,
		error: false,
		canceled: false
	}))
	this.loaded = this.state.length
	this._lastProgress = 0

	return new Promise(resolve => {
		const batch = {
			items: this.state,
			remaining: this.state.length,
			active: 0,
			nextIndex: 0,
			startedItems: new WeakSet(),
			cancelled: false,
			resolve
		}
		this._activeBatch = batch

		if (batch.remaining === 0) {
			this._activeBatch = null
			queueMicrotask(() => {
				invoke(this.oncomplete, batch.items)
				resolve(batch.items)
			})
			return
		}

		const settleItem = (settledItem, outcome) => {
			this._settledItems.add(settledItem)
			if (batch.startedItems.has(settledItem)) batch.active--
			batch.remaining--
			this.loaded = batch.remaining

			if (!batch.cancelled) this.updateProgressBar(settledItem)

			const finished = batch.remaining === 0
			if (finished) {
				this._activeBatch = null
				batch.resolve(batch.items)
			} else if (!batch.cancelled) {
				queueMicrotask(startNext)
			}

			if (outcome === 'error') invoke(this.onerror, settledItem)
			if (outcome !== 'cancelled') invoke(this.onfetched, settledItem)

			if (finished) {
				invoke(batch.cancelled ? this.oncancel : this.oncomplete, batch.items)
			}
		}
		batch.settleItem = settleItem

		const startNext = () => {
			if (batch.cancelled) return
			while (batch.active < this.concurrency && batch.nextIndex < batch.items.length) {
				const item = batch.items[batch.nextIndex++]
				batch.active++
				batch.startedItems.add(item)
				try {
					this.preloadOne(item.url, settleItem, item)
				} catch (error) {
					item.status = 0
					item.blobUrl = null
					item.size = null
					item.error = true
					item.failureReason = 'network'
					item.completion = 100
					settleItem(item, 'error')
				}
			}
		}

		startNext()
	})
}
