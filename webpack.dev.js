const path = require('path')
const pkg = require('./package.json')
module.exports = {
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		modules: [path.join(__dirname, 'node_modules')],
	},
	resolveLoader: {
		modules: [path.join(__dirname, 'node_modules')],
	},
	output: {
		filename: `index.js`,
		path: path.resolve(__dirname, 'dist'),
	},
	externalsType: 'node-commonjs',
	stats: {warnings:false}
}
