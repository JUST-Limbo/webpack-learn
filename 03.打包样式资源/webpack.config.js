/**
 * webpack.config.js webpack的配置文件
 * 模块化默认采用commonjs
 */

//  resolve用来拼接绝对路径
const {resolve} =require('path')

 module.exports={
  //  webpack配置
  // 入口起点
  entry:'./src/index.js',
  // 输出
  output:{
    // 输出文件名
    filename:'built.js',
    // 输出路径
    // __dirname nodejs的变量,代表当前目录的绝对路径
    path:resolve(__dirname,'build')
  },
  // loader的配置
  module:{
    rules:[
      // 详细loader的配置
      // 不同文件配置不同loader处理
      {
        // 匹配哪些文件
        test:/\.css$/,
        // 使用哪些loader进行处理
        use:[
          // user数组中loader依次执行
          // 创建style标签将js中的css样式资源插入进去,添加到head中生效
          'style-loader',
          // 将css文件以字符串形式变成commonjs模块加载到js中,里面内容是样式字符串
          'css-loader'
        ]
      },
      {
        test:/\.less$/,
        use:[
          'style-loader',
          'css-loader',
          // 将less文件编译成css文件
          // 需要下载less-loader 和 less
          'less-loader'
        ]
      }
    ]
  },
  // plugins的配置
  plugins:[
    // 详细的plugins的配置
  ],
  // 模式
  mode:'development',
  // mode:'production'
 }
