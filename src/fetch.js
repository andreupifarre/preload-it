export default function fetch(list) {	
	return new Promise((resolve, reject) => {
		this.loaded = list.length;
		for (var item of list) {
			this.status.push({url: item});
			this.preloadOne(item, item => {
				this.onfetched(item)
				this.loaded--;
				if (this.loaded==0) {
					this.oncomplete(this.status)
					resolve(this.status)
				}
			});
		}
	});
}