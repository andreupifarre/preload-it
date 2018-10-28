import preloadOne from './preloadOne.js'
import updateProgressBar from './updateProgressBar.js'
import getItemByUrl from './getItemByUrl.js'
import fetch from './fetch.js'

export default function Preload() {
	return {
		status: [],
		loaded: false,
		onprogress: () => {},
		oncomplete: () => {},
		onfetched: () => {},
		fetch,
		updateProgressBar,
		preloadOne,
		getItemByUrl
	}
}