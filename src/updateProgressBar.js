export default function updateProgressBar(item) {
	var sumCompletion = 0
	var maxCompletion = this.status.length * 100
	for (var itemStatus of this.status) {
		sumCompletion += itemStatus.completion 
	}
	var totalCompletion = parseInt((sumCompletion / maxCompletion) * 100)

	if (!isNaN(totalCompletion)) {
		this.onprogress({
			progress: totalCompletion,
			item: item
		})
	}
}