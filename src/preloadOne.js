export default function preloadOne(url, done) {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.responseType = 'blob'
	xhr.onprogress = event => {
		if (!event.lengthComputable) return false
		let item = this.getItemByUrl(event.target.responseURL)
		item.completion = parseInt((event.loaded / event.total) * 100)
		item.downloaded = event.loaded
		item.total = event.total
		this.updateProgressBar(item)
	}
	xhr.onload = event => {
		let type = event.target.response.type
		let blob = new Blob([event.target.response], { type: type })
		let url = URL.createObjectURL(blob)
		let responseURL = event.target.responseURL
		let item = this.getItemByUrl(responseURL)
		item.blobUrl = url
		item.fileName = responseURL.substring(responseURL.lastIndexOf('/') + 1)
		item.type = type
		item.size = blob.size
		done(item)
	}
	xhr.send()
}