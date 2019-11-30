import preloadOne from './preloadOne.js'
import updateProgressBar from './updateProgressBar.js'
import getItemByUrl from './getItemByUrl.js'
import fetch from './fetch.js'

export default function Preload(options) {
	return {
		state: [],
		loaded: false,
		stepped: (options && options.stepped) || true,
		onprogress: () => {},
		oncomplete: () => {},
		onfetched: () => {},
		onerror: () => {},
		fetch,
		updateProgressBar,
		preloadOne,
		getItemByUrl
	}
}