import count from './count.js'

console.log('index.js 文件加载了')

import('./add.js')
  .then(({default:add})=>{
    console.log(add(1,2))
  })

console.log(count(3,5))

