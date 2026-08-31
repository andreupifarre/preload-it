export default function updateProgressBar(item) {
	if (this.state.length === 0) return

	const canWeightByBytes = !this.stepped && this.state.every(itemState =>
		this._lengthComputableItems.has(itemState) || this._settledItems.has(itemState)
	)

	let progress
	if (canWeightByBytes) {
		const downloaded = this.state.reduce((sum, itemState) => sum + itemState.downloaded, 0)
		const total = this.state.reduce((sum, itemState) => sum + itemState.total, 0)
		progress = total > 0 ? Math.floor((downloaded / total) * 100) : 100
	} else {
		const completion = this.state.reduce((sum, itemState) => {
			return sum + (this._settledItems.has(itemState) ? 100 : itemState.completion)
		}, 0)
		progress = Math.floor(completion / this.state.length)
	}

	progress = Math.max(this._lastProgress, Math.min(progress, 100))
	this._lastProgress = progress
	try {
		this.onprogress({ progress, item })
	} catch (error) {
		setTimeout(() => { throw error }, 0)
	}
}
