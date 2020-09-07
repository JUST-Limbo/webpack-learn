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
  modules:{
    rules:[
      // loader的配置
      {
        test:/\.css$/,
        // 多个loader用use
        use:['style-loader','css-loader']
      },
      {
        test:/\.js$/,
        // 排除node_modules下的js文件
        exclude:/node_modules/,
        include:resolve(__dirname,'src'),
        // 优先执行 pre 延后执行 post
        enforce:'pre',
        // 单个loader用loader
        loader:'eslint-loader',
        options:{}
      },{
        // 以下配置只会生效一个
        oneOf:[]
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
      $css:resolve(__dirname,'src/css')
    },
    // 配置省略文件路径的后缀名
    extensions:['.js','.json','.css'],
    // 告诉webpack解析模块去哪个目录
    modules:[resolve(__dirname,'../../../node_modules'),'node_modules']
  },
}
