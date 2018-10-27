# preload.js

Preload is a 1.1kb JavaScript library for preloading assets on the browser. Preload provides the ability to load assets of different
file types, composite progress events.

## Getting started

```js
const preload = Preload();

preload.fetch([
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg'
])

preload.oncomplete = items => {
  console.log(items);
}

preload.onprogress = event => {
  console.log(event.progress + '%');
}

preload.onfetched = item => {
  console.log(item);
}
```

## License

Released for free under the MIT license, which means you can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a requirement.

[MIT](LICENSE).
