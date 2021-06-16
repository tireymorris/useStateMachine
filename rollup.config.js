import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' },
			{
				name: 'index',
				file: pkg.browser,
				format: 'umd'
			}
		],
		plugins: [
			typescript(),
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	}
];
