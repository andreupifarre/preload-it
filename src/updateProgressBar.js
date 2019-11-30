export default function updateProgressBar(item) {
	let sumCompletion = 0
	let maxCompletion = this.stepped ? (this.state.length * 100) : 0
	let initialisedCount = 0
	
	for (const itemState of this.state) {
		if (itemState.completion) initialisedCount++
		if (this.stepped) {
			if (itemState.completion) {
				sumCompletion += itemState.completion;
			}
		} else {
			if (this._readyForComputation) {
				sumCompletion += itemState.downloaded
				maxCompletion += itemState.total
			} else {
				sumCompletion = maxCompletion = 0
			}
		}
	}

	this._readyForComputation = (initialisedCount == this.state.length)

	const totalCompletion = parseInt((sumCompletion / maxCompletion) * 100)

	if (!isNaN(totalCompletion)) {
		this.onprogress({
			progress: totalCompletion,
			item: item
		})
	}
}