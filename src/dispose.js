export default function dispose() {
	this.cancel()

	for (const objectUrl of this._objectUrls) {
		URL.revokeObjectURL(objectUrl)
	}
	this._objectUrls.clear()

	return this.state
}
