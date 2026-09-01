export default function cancel() {
	const batch = this._activeBatch
	if (!batch || batch.cancelled) return this.state

	batch.cancelled = true
	for (const item of batch.items) {
		if (this._settledItems.has(item)) continue
		if (item.xhr) {
			item.xhr.abort()
		} else {
			item.status = 0
			item.blobUrl = null
			item.size = null
			item.error = false
			item.canceled = true
			item.failureReason = 'abort'
			batch.settleItem(item, 'cancelled')
		}
	}

	return this.state
}
