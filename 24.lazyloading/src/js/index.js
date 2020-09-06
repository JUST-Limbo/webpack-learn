
console.log('index.js文件被加载');


document.getElementById('btn').onclick = function () {
  // 懒加载:当文件需要时才加载
  // webpackPrefetch 预加载:会在使用前,提前加载js文件
  // 正常加载:可认为是并行加载(同一时间加载多个文件)  
  // 预加载:等其他资源加载完毕,浏览器空闲了再加载资源
  import(/* webpackChunkName: 'test', webpackPrefetch:true */'./test')
    .then(({ mul }) => {
      console.log(mul(4, 5))
    })
}
