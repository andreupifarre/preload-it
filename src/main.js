import preloadOne from './preloadOne.js'
import updateProgressBar from './updateProgressBar.js'
import getItemByUrl from './getItemByUrl.js'
import fetch from './fetch.js'
import cancel from './cancel.js'

export default function Preload(options) {
	return {
		state: [],
		loaded: false,
		stepped: (options && options.stepped) || true,
		onprogress: () => {},
		oncomplete: () => {},
		onfetched: () => {},
		onerror: () => {},
		oncancel: () => {},
		fetch,
		updateProgressBar,
		preloadOne,
		getItemByUrl,
		cancel
	}
}