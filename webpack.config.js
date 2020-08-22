const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: {
		'RecordRTC': './RecordRTC.js',
		'RecordRTC.min': './RecordRTC.js'
	},
	mode: 'production',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
		library: 'RecordRTC',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
				test: /\.min\.js$/,
				extractComments: false,
				sourceMap: true
      }),
    ],
  },
}
