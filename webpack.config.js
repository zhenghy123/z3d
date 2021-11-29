const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const resolve = (function () {
	return function (name) {
	return	path.resolve(__dirname, name);
	};
})();

module.exports = {
	mode: 'development',
	entry: {
		z3d: resolve('./src/index.js'),
	},
	output: {
		path: resolve('dist'),
		filename: '[name].[contenthash].js',
		clean: true,
	},
	// devtool: 'clean-cheap-source-map',
	devServer: {
		static: __dirname,
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
						},
					},
					{
						loader: 'sass-loader',
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'z3d',
			template: './src/index.html',
		}),
	],
};
