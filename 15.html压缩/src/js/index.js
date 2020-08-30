// import '@babel/polyfill'

function add(x, y) {
  return x + y;
}
//  warning  Unexpected console statement  no-console
// ↓下一行eslint所有规则都失效(下一行不进行eslint检查)
// eslint-disable-next-line
console.log(add(2, 5));

const promise=new Promise((resolve,reject)=>{
  setTimeout(()=>{
    console.log('123123');
    resolve()
  },1000)
})

console.log(promise);
