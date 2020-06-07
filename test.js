new Promise(resolve => {  // 1. 执行promise的回调（同步任务），输出【1】
  console.log(1);
  resolve()
}).then(res => {    // 2. then为异步任务-微任务，放到微任务队列中(1)
  console.log(2);
  setTimeout(() => console.log(6), 1);  // 定时器为异步任务-宏任务，放到宏任务队列中(1)
}).then(res => {
  console.log(3)  // then为异步任务-微任务，放到微任务队列中(2)
});
setTimeout(() => console.log(4), 1);  
console.log(5);