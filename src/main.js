import preloadOne from './preloadOne.js';
import updateProgressBar from './updateProgressBar.js';
import getItemByUrl from './getItemByUrl.js';

export default function Preload() {
	return {
		progressRate: 0,
		status: [],
		loaded: false,
		onprogress: () => {},
		oncomplete: () => {},
		onfetched: () => {},
		fetch: function(list) {
			this.loaded = list.length;
			for (var item of list) {
				this.status.push({url: item});
				this.preloadOne(item, item => {
					this.onfetched(item)
					this.loaded--;
					if (this.loaded==0) {
						this.oncomplete(this.status)
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