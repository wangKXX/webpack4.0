const merge = require('webpack-merge')
const base = require('./webpack.base')
const webpack = require('webpack')

const dev_config = {
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    contentBase: './dist'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev')
    })
  ]
}

module.exports = merge(base, dev_config)