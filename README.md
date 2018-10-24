# preload

[![Greenkeeper badge](https://badges.greenkeeper.io/rollup/rollup-starter-lib.svg)](https://greenkeeper.io/)

Preload is a 1.1kb JavaScript library for preloading assets on the browser. Preload provides the ability to load assets of different
file types, composite progress events.

## Getting started

```js
const preload = Preload();
preload.preload([
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    //'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?cs=srgb&dl=beach-exotic-holiday-248797.jpg&fm=jpg'
], items => {
    console.log(items);
}).onprogress = event => {
  console.log(event.progress + '%');
}
```

## License

Released for free under the MIT license, which means you can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a requirement.

[MIT](LICENSE).
