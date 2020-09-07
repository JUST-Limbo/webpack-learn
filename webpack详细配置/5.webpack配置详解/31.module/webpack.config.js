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
  resolve:{
    // 配置解析模块路径别名
    alias:{

    }
  }
}
