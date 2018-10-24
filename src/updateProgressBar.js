export default function updateProgressBar() {
	var sumCompletion = 0
	var maxCompletion = this.status.length * 100
	for (var item of this.status) {
		sumCompletion += item.completion 
	}
	var totalCompletion = parseInt((sumCompletion / maxCompletion) * 100)

	if (!isNaN(totalCompletion)) {
		this.onprogress({
			progress: totalCompletion
		})
	}
}