const merge = require('webpack-merge')
const base = require('./webpack.base')
const uglifyjs = require('uglifyjs-webpack-plugin')
const uglifycss = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')
const ParallelPlugin = require('webpack-parallel-uglify-plugin')
const prd_config = {
  plugins: [
    new webpack.DefinePlugin({
      isPrd: JSON.stringify(true)
    }), 
    new uglifycss(),
    new ParallelPlugin({
      uglifyJS: {
        output: {
          beautify: false, //不需要格式化
          comments: false //不保留注释
        },
        compress: {
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
  ],
  optimization: {
    minimizer: [new uglifyjs()],
  }
}

module.exports = merge(base, prd_config)