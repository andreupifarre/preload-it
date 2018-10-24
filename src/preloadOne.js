export default function preloadOne(url, done) {
	var self = this;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	//xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.responseType = 'arraybuffer';
	xhr.onprogress = function(event) {
		if (event.lengthComputable) {
			var item = self.getItemByUrl(event.target.responseURL);
			item.completion = parseInt((event.loaded / event.total) * 100);
			self.updateProgressBar();
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

		done(url, type);
		return false;
	};
	xhr.send();
}