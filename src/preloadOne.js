export default function preloadOne(url, done) {
	var self = this;
	self.lastProgressTime = 0;

	const startTime = function() {
		self.lastProgressTime = new Date();
	}

	const endTime = function() {
		let timeDiff = (new Date()) - self.lastProgressTime;
		return isNaN(timeDiff) ? 0 : timeDiff;
	}

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	//xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.responseType = 'blob';
	xhr.onprogress = function(event) {
		//if (event.lengthComputable && endTime() > 500) {
		if (event.lengthComputable) {
			var item = self.getItemByUrl(event.target.responseURL);
			item.completion = parseInt((event.loaded / event.total) * 100);
			//item.completion = item.completion || 0;
			item.downloaded = event.loaded;
			item.total = event.total;
			self.updateProgressBar(item);
			//startTime();
		}
		
	};
	xhr.onload = function(event) {
		var type = event.target.response.type;
		var blob = new Blob([event.target.response], {
			type: type
		});
		var url = URL.createObjectURL(blob);
		var responseURL = event.target.responseURL;
		var item = self.getItemByUrl(responseURL);
		item.blobUrl = url;
		item.fileName = responseURL.substring(responseURL.lastIndexOf('/')+1);
		item.type = type;
		item.size = blob.size;

		done(item);
		return false;
	};
	xhr.send();
}