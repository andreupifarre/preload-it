import terser from '@rollup/plugin-terser'

const input = 'src/main.js'

export default [
	{
		input,
		output: { name: 'Preload', file: 'dist/preload-it.js', format: 'umd' }
	},
	{
		input,
		output: { name: 'Preload', file: 'dist/preload-it.min.js', format: 'umd' },
		plugins: [terser()]
	},
	{
		input,
		output: [
			{ file: 'dist/preload-it.esm.js', format: 'es' },
			{ file: 'dist/preload-it.esm.mjs', format: 'es' }
		]
	},
	{
		input,
		output: { file: 'dist/preload-it.esm.min.js', format: 'es' },
		plugins: [terser()]
	}
]
