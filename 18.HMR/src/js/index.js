import print from './print';
import '../css/iconfont.css';
import '../css/index.less'

console.log('index重新加载');

print()

function add(x, y) {
  return x + y
}

console.log(add(1, 2));
console.log(add(1, 2));

if (module.hot) {
  // module.hot为true说明开启了HMR功能-->让HMR功能代码生效
  module.hot.accept('./print.js', function () {
    // 方法会监听print.js文件的变化,一旦发生变化,其他模块不会重新打包构建
    print()
  })
}
