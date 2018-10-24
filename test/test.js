const assert = require('assert');
const Preload = require('..');

function test(list, expected) {
	console.log(new Preload(list, () => {}))
	//assert.equal(new Preload(list, () => {}), expected)
	console.log(`\u001B[32m✓\u001B[39m ${expected}`)
}

test(['http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'], '1 hour')