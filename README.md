# preload.js

Preload is a 1kb JavaScript library for preloading assets on the browser. Preload provides the ability to load assets of different file types and composite progress events.

## Installing

If you use npm, `npm install preload.js`. Otherwise, download the [latest release](https://github.com/andreupifarre/preload.js/releases/latest). The released bundle supports anonymous AMD, CommonJS, and vanilla environments. You can load directly from [unpkg](https://unpkg.com/preload.js/). For example:

```html
<script src="https://preload.js"></script>
```

For the minified version:

```html
<script src="https://preload.min.js"></script>
```

preload.js is written using [ES2015 modules](http://www.2ality.com/2014/09/es6-modules-final.html). Create a [custom bundle using Rollup](https://bl.ocks.org/mbostock/bb09af4c39c79cffcde4), Webpack, or your preferred bundler. To import preload.js into an ES2015 application, import into a namespace:

```js
import * as preload from "preload";
```

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

[See a live example](https://andreupifarre.github.io/preload.js/docs/index.html)

## License

Released for free under the MIT license, which means you can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a requirement.

[MIT](LICENSE).
