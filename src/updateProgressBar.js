export default function updateProgressBar(item) {
	var sumCompletion = 0
	var maxCompletion = this.state.length * 100

	for (var itemState of this.state) {
		if (itemState.completion) {
			sumCompletion += itemState.completion;
		}
	}
	var totalCompletion = parseInt((sumCompletion / maxCompletion) * 100)

	if (!isNaN(totalCompletion)) {
		this.onprogress({
			progress: totalCompletion,
			item: item
		})
	}
}