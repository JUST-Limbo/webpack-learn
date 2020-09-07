const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/*
*/

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build'),
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
  mode: 'development',
  // 解析模块的规则
  resolve: {
    // 配置解析模块路径别名:简写路径 缺点路径没有提示
    alias: {
      $css: resolve(__dirname, 'src/css')
    },
    // 配置省略文件路径的后缀名
    extensions: ['.js', '.json', '.css'],
    // 告诉webpack解析模块去哪个目录
    modules: [resolve(__dirname, '../../../node_modules'), 'node_modules']
  },
  devServer: {
    // 运行代码的目录
    contentBase: resolve(__dirname, 'build'),
    // 监视contentBase目录下的所有文件,一旦文件变化就会reload
    watchContentBase: true,
    watchOptions:{
      // 忽略文件
      ignored:/node_modules/
    },
    // 启动gzip
    compress: true,
    port: 5000,
    // 域名
    host: 'localhost',
    // 自动打开浏览器
    open: true,
    // HMR
    hot: true,
    // 不要显示启动服务器日志信息
    clientLogLevel: 'none',
    // 除了基本启动信息外其他内容都不要现实
    quiet:true,
    // 如果出现错误,不要全屏提示
    overlay:false,
    // 服务器代理-->解决开发环境跨域问题
    proxy:{
      // 一旦devServer(5000)服务器接收到 /api/xxx的请求,就会把请求转发到另一个服务器(3000)
      '/api':{
        target:'http://localhost:3000',
        // 发送请求时,请求路径重写:将/api/xxx --> /xxx (去掉/api)
        pathRewrite:{
          '^/api':''
        }
      }
    }
  }
}
