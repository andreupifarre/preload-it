export default function preloadOne(url, done) {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.responseType = 'blob'
	xhr.onprogress = event => {
		if (!event.lengthComputable) return false
		const item = this.getItemByUrl(url)
		item.completion = parseInt((event.loaded / event.total) * 100)
		item.downloaded = event.loaded
		item.total = event.total
		this.updateProgressBar(item)
	}
	xhr.onload = event => {
		const type = event.target.response.type
		const responseURL = event.target.responseURL
		const item = this.getItemByUrl(url)

		item.fileName = responseURL.substring(responseURL.lastIndexOf('/') + 1)
		item.type = type
		item.status = xhr.status

		if (xhr.status == 404) {
			item.blobUrl = item.size = null
			item.error = true
			this.onerror(item)
		} else {
			const blob = new Blob([event.target.response], { type: type })
			item.blobUrl = URL.createObjectURL(blob)
			item.size = blob.size
			item.error = false
		}
		done(item)
	}
	xhr.send()
}