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
		filename: `[name].js`,
		path: path.resolve(__dirname, 'dist'),
		library: {
			name: 'java-edition-command-parser',
			type: 'umd',
		},
	},
	externalsType: 'node-commonjs',
	stats: { warnings: false },
}
