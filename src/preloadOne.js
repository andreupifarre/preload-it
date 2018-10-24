export default function preloadOne(url, done) {
	var self = this;

	const startTime = function() {
		self.lastProgressTime = new Date();
	}

	const endTime = function() {
        let timeDiff = (new Date()) - self.lastProgressTime;
        return timeDiff;
	}

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	//xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.responseType = 'arraybuffer';
	xhr.onprogress = function(event) {
		console.log();
		if (event.lengthComputable && endTime() > 300) {
			var item = self.getItemByUrl(event.target.responseURL);
			item.completion = parseInt((event.loaded / event.total) * 100);
			item.downloaded = event.loaded;
			item.total = event.total;
			self.updateProgressBar(item);
			startTime();
		}
		
	};
	xhr.onload = function(event) {
		var type = 'video/mp4';
		var blob = new Blob([event.target.response], {
			type: type
		});
		var url = URL.createObjectURL(blob);
		var item = self.getItemByUrl(event.target.responseURL);
		item.blobUrl = url;
		item.type = type;
		item.size = blob.size;

		done(item);
		return false;
	};
	xhr.send();
}