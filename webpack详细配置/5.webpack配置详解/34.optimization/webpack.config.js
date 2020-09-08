const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/*
*/

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  modules: {
    rules: [
      // loader的配置
      {
        test: /\.css$/,
        // 多个loader用use
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        // 排除node_modules下的js文件
        exclude: /node_modules/,
        include: resolve(__dirname, 'src'),
        // 优先执行 pre 延后执行 post
        enforce: 'pre',
        // 单个loader用loader
        loader: 'eslint-loader',
        options: {}
      }, {
        // 以下配置只会生效一个
        oneOf: []
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'production',
  resolve: {
    alias: {
      $css: resolve(__dirname, 'src/css')
    },
    extensions: ['.js', '.json', '.css'],
    modules: [resolve(__dirname, '../../../node_modules'), 'node_modules']
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      // 默认值 可以不写
      // minSize:30*1024, //分割的chunk最小为30kb
      // maxSize:0, // 最大无限制
      // minChunks:1, // 要提取的chunk最少被引用1次
      // maxAsyncRequests:5, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests:3, // 入口js文件最大并行请求数量
      // autoMaticNameDelimiter:'~', // 名称连接符
      // name:true, // 可以使用命名规则
      // cacheGroups:{ // 分割chunk的组
      //   // node_modules 文件会被打包到vendors组的chunk中-->vendors~xxx.js
      //   // 满足上面的公共规则 入大小超过30kb 至少被引用1次
      //   vendors:{
      //     test: /[\\/]node_modules[\\/]/,
      //     // 优先级
      //     priority:-10
      //   },
      //   default:{
      //     // 要提取的chunk最少被引用2次
      //     minChunks: 2,
      //     // 优先级
      //     priority: -20,
      //     // 如果当前要打包的模块和之前已经被提取的模块是同一个,就会复用,而不是重新打包模块
      //     reuseExistingChunk:true
      //   }
      // }
    }
  }
}
