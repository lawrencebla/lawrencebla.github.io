var path = require('path');

module.exports = {
	entry: './exp1/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	// module: {
	// 	rules: [
	// 		{test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
	// 	]
	// }
}