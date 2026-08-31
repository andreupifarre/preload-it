import preloadOne from './preloadOne.js'
import updateProgressBar from './updateProgressBar.js'
import getItemByUrl from './getItemByUrl.js'
import fetch from './fetch.js'
import cancel from './cancel.js'
import dispose from './dispose.js'

export default function Preload(options) {
	const settings = options || {}
	const timeout = settings.timeout == null ? 0 : settings.timeout
	if (typeof timeout !== 'number' || !Number.isFinite(timeout) || timeout < 0) {
		throw new TypeError('Preload timeout must be a non-negative number')
	}

	return {
		state: [],
		loaded: false,
		stepped: settings.stepped !== false,
		timeout,
		onprogress: () => {},
		oncomplete: () => {},
		onfetched: () => {},
		onerror: () => {},
		oncancel: () => {},
		_activeBatch: null,
		_lastProgress: 0,
		_settledItems: new WeakSet(),
		_lengthComputableItems: new WeakSet(),
		_objectUrls: new Set(),
		fetch,
		updateProgressBar,
		preloadOne,
		getItemByUrl,
		cancel,
		dispose
	}
}
