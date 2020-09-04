const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

/*
  缓存:
    babel缓存
      cacheDirectory: true
      第二次打包速度更快
    文件资源缓存
      hash:
        每次webpack构建打包会生成唯一hash值
        问题:因为js和css同时使用一个hash值。
          如果重新打包，会导致所有缓存失效（可能会导致只改动一个文件，全部缓存失效）
      chunkhash
        根据chunk生成的hash值，如果打包来源于同一个chunk,那么hash值就一样
        问题:js和css的hash值是一样的,因为css是在js中被引入的,所以同属于一个chunk
      contenthash:根据文件的内容生成hash,不同文件hash值不一定一样
      -->上线代码优化
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
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'production',
  devtool:'source-map'
}
