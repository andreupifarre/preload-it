export default function cancel() {
	const batch = this._activeBatch
	if (!batch || batch.cancelled) return this.state

	batch.cancelled = true
	for (const item of batch.items) {
		if (!this._settledItems.has(item) && item.xhr) item.xhr.abort()
	}

	return this.state
}
