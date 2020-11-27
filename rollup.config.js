import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify-es';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const getBabelPlugin = () => {
  return babel({
    presets: [
      ['@babel/preset-env', {
        modules: false
      }]
    ]
  });
};

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'Preload',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			getBabelPlugin()
		]
	},
	{
		input: 'src/main.js',
		output: {
			name: 'Preload',
			file: pkg.minified,
			format: 'umd'
		},
		plugins: [
			uglify(),
			getBabelPlugin()
		]
	},
	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		output: [
			// { file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			getBabelPlugin()
		]
	},
	{
		input: 'src/main.js',
		output: [
			// { file: pkg.main, format: 'cjs' },
			{ file: pkg.module_minified, format: 'es' }
		],
		plugins: [
			uglify(),
			getBabelPlugin()
		]
	}
];
