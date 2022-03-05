const path = require('path')
const pkg = require('./package.json')
const production = process.argv.includes('--mode=production')
const commonConfig = require(`./webpack.${production ? 'prod' : 'dev'}.js`)
console.log('production:', production)
module.exports = () => ({
	...commonConfig,
	entry: './src/main.ts',
	target: 'node',
})
