/*
  HMR: hot module replacement 热模块替换 / 模块热替换
  作用:一个模块发生变化,只会重新打包这一个模块,而不是打包所有,极大提升构建速度

  样式文件:可以使用HMR功能 因为style-loader内部实现了
  js文件:默认不使用HMR功能--->需要修改js代码,添加支持HMR功能的代码
    注意:HMR功能对js的处理,只能处理非入口js文件的其他文件。
  html:默认不能使用HMR功能,同时会导致问题:html文件不能热更新
    解决:修改entry入口,将html文件引入
*/


const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ['./src/js/index.js','./src/index.html'],
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
    compress: true,
    port: 8000,
    open: true,
    hot:true
  },
  devtool:'eval-source-map'
}
/*
  source-map:一种 提供源代码到构建后代吗映射 的技术 (如果后代码出错了,通过映射追踪到源代码错误)
    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
    source-map:外部
      错误代码的准确信息 和 源代码的错误位置
    inline-source-map:内联
      只生成一个内联source-map
    hidden-source-map:外部
      提示错误代码的原因,但是没有错误位置
      不能追踪到源代码错误,只能提示到构建后代码的错误
    eval-source-map:内联
      每一个文件都生成对应的source-map都在eval
      错误代码准确信息 和 源代码错误位置
    nosources-source-map:外部
      错误代码准确信息,但是没有任何源代码错误
    cheap-source-map:外部
      错误代码的准确信息 和 源代码的错误位置
      只能精确到行
    cheap-module-souce-map:外部
      错误代码的准确信息 和 源代码的错误位置
      module会将webpack loader的sourcemap加入

    内联和外部的区别: 外部生成文件,内联没有 2.内联构建速度更快

    开发环境:速度快,调试更友好
      速度快(eval>inline>cheap)
        eval-cheap-source-map
        eval-source-map
      调试友好
        source-map
        cheap-module-souce-map 
        cheap-source-map
    
      --> eval-source-map  /  eval-cheap-module-souce-map

    生产环境:源代码要不要隐藏?调试要不要更友好
      内联会让代码体积变大,所以在生产环境中不用内联
      nosources-source-map 全部隐藏
      hidden-source-map 只隐藏源代码,会提示构建后代码错误信息

      -->source-map / cheap-module-souce-map
*/
