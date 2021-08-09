const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'luma.gl Demo'
    })
  ],
  output: {
    filename: 'bundle.js'
  }
};