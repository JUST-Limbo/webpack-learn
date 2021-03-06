const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

/*
  PWA:渐进式网络开发应用程序(离线可访问)
    workbox-->workbox-webpack-plugin
*/

process.env.NODE_ENV = 'production'

// 服用loader
const commonCssLoader = [
  // 放在css-loader上面
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // css兼容性处理需要在package.json的browserlist里配置
    // 开发环境 --> 设置node环境变量:process.env.NODE_ENV=development
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        // postcss的插件
        require('postcss-preset-env')()
      ]
    }
  }
]

module.exports = {
  entry: './src/js/index.js',
  output: {
    // filename: 'js/built.[chunkhash:10].js',
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        // package.json中eslintConfig中设置
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        // 以下loader只会匹配一个
        // 不能有两个配置处理同一种类型文件
        oneOf: [{
          test: /\.css$/,
          use: [
            ...commonCssLoader
          ]
        },
        {
          test: /\.less$/,
          use: [
            ...commonCssLoader,
            'less-loader'
          ]
        },
        /*
          通常一个文件只能被一个loader处理
          当一个文件要被多个loader处理,则一定要指定loader的执行顺序
          先执行eslint-loader 再执行babel-loader
        */
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            //  预设:指示babel做怎么样的兼容性处理
            presets: [
              [
                '@babel/preset-env',
                {
                  // 按需加载
                  useBuiltIns: 'usage',
                  // 指定core-js版本
                  corejs: {
                    version: 3
                  },
                  // 指定兼容性具体做到哪个版本浏览器
                  targets: {
                    chrome: '60',
                    firefox: '50',
                    ie: '9',
                    safari: '10',
                    edge: '17'
                  }
                }
              ]
            ],
            // 开启babel缓存
            // 第二次构建时,会读取之前的缓存
            cacheDirectory: true
          }
        },
        {
          test: /\.(jpg|png|gif)/,
          loader: 'url-loader',
          options: {
            limit: 8 * 1024,
            esModule: false,
            name: '[hash:10].[ext]',
            outputPath: 'imgs'
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          exclude: /\.(js|css|less|html|jpg|png|gif)/,
          loader: 'file-loader',
          options: {
            outputPath: 'media'
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      // filename: 'css/built.[contenthash:10].css'
      filename: 'css/built.[contenthash:10].css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      /*
        1.帮助serviceworker快速启动
        2.删除旧的serviceworker

        生成一个serviceworker配置文件
      */
      clientsClaim:true,
      skipWaiting:true
    })
  ],
  mode: 'production',
  devtool:'source-map'
}
