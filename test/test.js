describe('fetch', function () {
	const media = [
		'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
		// 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp43',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
		'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
		'ForBiggerJoyrides.mp4'
	]

	it('should track downloading progress', function (done) {
		const preload = Preload()
		preload.fetch(media)

		let progress = 0

		preload.onprogress = event => {
			const item = event.item
			chai.expect(parseInt((item.downloaded / item.total) * 100)).to.equal(item.completion)
			if (item.completion == 100) {
				chai.expect(item.url).to.equal(preload.getItemByUrl(item.url).url)
				chai.expect(item.total).to.equal(item.downloaded)
			}
			progress = event.progress
		}

		preload.oncomplete = items => {
			chai.expect(progress).to.equal(100)
			done()
		}
	})
	
	it('should complete the download of all requests', function (done) {
		const preload = Preload()
		preload.fetch(media)

		preload.oncomplete = items => {
			for (const item of items) {
				chai.expect(item.url).to.equal(preload.getItemByUrl(item.url).url)
				chai.expect(item.total).to.equal(item.downloaded)
				chai.expect(item.size).to.equal(item.total)
				chai.expect(item.completion).to.equal(100)
			}
			done()
		}
	})

	it('should fetch individual requests', function (done) {
		const preload = Preload()
		preload.fetch(media)
		
		let files = 1
		preload.onfetched = item => {
			if (item.completion == 100) {
				chai.expect(item.url).to.equal(preload.getItemByUrl(item.url).url)
				chai.expect(item.total).to.equal(item.downloaded)
				chai.expect(item.size).to.equal(item.total)
			}

			if (files == media.length) {
				chai.expect(media.length).to.equal(files)
				done()
			}
			files++
		}
	})

	it('should trigger an error if an asset returns 404', function (done) {
		const media404 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp43'

		const preload = Preload()
		preload.fetch([media404])
		
		preload.onerror = item => {
			chai.expect(item.url).to.equal(media404)
			done()
		}
	})
})