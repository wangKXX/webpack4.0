const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isPrd = process.env.NODE_ENV === 'production'
const HappyPack = require('happypack')
const os = require('os') //获取电脑的处理器有几个核心，作为配置传入
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const PurifyCss = require('purifycss-webpack') // 去除多余的css
const glob = require('glob')

console.log(isPrd, 'isProd')
module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
    print: path.resolve(__dirname, './src/print.js')
  },
  output: {
    filename: 'script/[Hash:5]-[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    noParse: /lodash/,
    rules: [
      {
        test: /\.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(png|jpg|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[Hash:5]-[name].[ext]',
              outputPath: './images'
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'happypack/loader?id=happy-babel-js'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css', '.json', '.scss'],
    alias: {
      src: path.resolve(__dirname, './src')
    },
    modules: [path.resolve(__dirname, './src'), 'node_modules']
  },
  plugins: [
    new PurifyCss({
      paths: glob.sync(path.resolve(__dirname, './*.html'))
    }),
    new HappyPack({ //开启多线程打包
      id: 'happy-babel-js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool
    }),
    new ProgressBarPlugin({
        format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: 'body',
      chunks: ['index', 'commons', 'usercommons'],
      minify: {
        removeAttributeQuotes: true // 压缩 去掉引号
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'print.html',
      template: './print.html',
      inject: 'body',
      chunks: ['print', 'commons', 'usercommons'],
      minify: {
        removeAttributeQuotes: true // 压缩 去掉引号
      }
    }),
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({ // 单独提取css
      filename: 'style/[Hash:5]-[name].css'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 3000,
      maxSize: 0,
      maxAsyncRequests: 5, // 按需加载最大并行数(处理高并发)
      maxInitialRequests: 3, // 入口最大并行请求数
      minChunks: 1,
      automaticNameDelimiter: '-',
      cacheGroups: {
        commons: { // 将node_modules下的公用模块打包为一个js文件
          test: /[\\/]node_modules[\\/]/,
          name: 'commons',
          chunks: 'initial',
          minChunks: 1
        },
        usercommoms: { // 将src下的用户js单独打包
          test: /[\\/]src[\\/]js[\\/]/,
          name: 'usercommons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
    // runtimeChunk: { // 缓存相关
    //   name: 'manifest'
    // }
  }
}