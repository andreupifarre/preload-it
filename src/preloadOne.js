export default function preloadOne(url, done, requestItem) {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.responseType = 'blob'
	xhr.timeout = this.timeout

	const item = requestItem || this.getItemByUrl(url)
	if (!item) throw new Error(`No preload item exists for URL: ${url}`)
	item.xhr = xhr
	let settled = false

	const finish = outcome => {
		if (settled) return
		settled = true
		done(item, outcome)
	}

	const fail = (reason, status) => {
		item.status = status || 0
		item.blobUrl = null
		item.size = null
		item.error = true
		item.canceled = false
		item.failureReason = reason
		item.completion = 100
		finish('error')
	}
	
	xhr.onprogress = event => {
		item.downloaded = event.loaded
		if (event.lengthComputable && event.total > 0) {
			this._lengthComputableItems.add(item)
			item.total = event.total
			item.completion = Math.floor((event.loaded / event.total) * 100)
		}
		this.updateProgressBar(item)
	}
	xhr.onload = () => {
		item.status = xhr.status

		if (xhr.status < 200 || xhr.status >= 300) {
			fail('http', xhr.status)
			return
		}

		const blob = xhr.response
		const responseURL = xhr.responseURL || url
		const cleanURL = responseURL.split(/[?#]/)[0]
		item.fileName = cleanURL.substring(cleanURL.lastIndexOf('/') + 1)
		item.type = blob.type
		item.blobUrl = URL.createObjectURL(blob)
		this._objectUrls.add(item.blobUrl)
		item.size = blob.size
		item.downloaded = blob.size
		item.total = blob.size
		item.completion = 100
		item.error = false
		item.canceled = false
		delete item.failureReason
		finish('success')
	}
	xhr.onerror = () => fail('network', xhr.status)
	xhr.ontimeout = () => fail('timeout', xhr.status)
	xhr.onabort = () => {
		item.status = 0
		item.blobUrl = null
		item.size = null
		item.error = false
		item.canceled = true
		item.failureReason = 'abort'
		finish('cancelled')
	}
	try {
		xhr.send()
	} catch (error) {
		fail('network', xhr.status)
	}
}
