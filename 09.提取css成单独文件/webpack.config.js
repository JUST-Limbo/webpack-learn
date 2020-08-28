const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin =  require('mini-css-extract-plugin')


module.exports={
  entry:'./src/js/index.js',
  output:{
    filename:'js/built.js',
    path:resolve(__dirname,'build')
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use:[
          // 创建style标签,将样式放入
          // 'style-loader',
          // MiniCssExtractPlugin.loader 取代style-loader 作用:提取css成单独文件
          MiniCssExtractPlugin.loader,
          // css文件整合到js文件中
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename:'css/built.css'
    })
  ],
  mode:'development'
}
