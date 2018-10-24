import preloadOne from './preloadOne.js';
import updateProgressBar from './updateProgressBar.js';
import getItemByUrl from './getItemByUrl.js';

export default function Preload() {
	return {
		status: [],
		loaded: false,
		onprogress: () => {},
		oncomplete: () => {},
		onfetched: () => {},
		fetch: function(list) {
			this.loaded = list.length;
			for (var item of list) {
				this.status.push({url: item});
				this.preloadOne(item, () => {
					this.loaded--;
					if (this.loaded==0) {
						this.oncomplete(this.status)
					} else {
						this.onfetched(this.status[this.loaded])
					}
				});
			}
			
			return this;
		},
		updateProgressBar,
		preloadOne,
		getItemByUrl
	}
}