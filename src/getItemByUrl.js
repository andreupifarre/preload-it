export default function getItemByUrl(rawUrl) {
  for (var item of this.status) {
    if (item.url == rawUrl) {
      return item;
    }
  }
}