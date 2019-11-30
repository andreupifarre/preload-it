export default function getItemByUrl(rawUrl) {
    for (var item of this.state) {
        if (item.url == rawUrl) return item
    }
}