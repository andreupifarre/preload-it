export default function getItemByUrl(rawUrl) {
	for (const item of this.state) {
		if (item.url === rawUrl) return item
	}
}
