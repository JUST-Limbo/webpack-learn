const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        // 要使用多个loader处理用use
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        // 问题:只能处理样式中的资源,处理不了html中的img图片
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        // 使用一个loader
        // 下载url-loader file-loader (依赖关系)
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb使用base64处理
          // 优点:减少请求数量(减轻服务器压力)
          // 缺点:图片体积会更大(文件请求速度更慢)
          limit: 8 * 1024,
          // 问题 因为url-loader默认使用es6模块化解析,html-loader引入图片是commonjs
          // 解析时会出现问题:[object Module]
          // 解决:关闭url-loader的es6模块化,使用commonjs解析
          esModule: false,
          // 给图片进行重命名
          // [hash:10]取图片的hash前十位
          // [ext]取文件原来的扩展名
          name: '[hash:10].[ext]',
          outputPath:'imgs'
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片(负责引入img,从而能被url-loader进行处理)
        loader: 'html-loader'
      },
      {
        exclude: /\.(css|js|html|jpg|png|gif|less)/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath:'media'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development',
  // 开发服务器 devServer : 用来自动(自动编译,自动打开浏览器,自动刷新浏览器)
  // 特点:只会内存中编译打包,不会有任何输出
  // 启动devServer指令为npx webpack-dev-server
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 8000,
    open: true
  }
}
