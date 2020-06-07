/**
 * 块作用域：
 */

{
  let a = 2;
  var b = 2;
  console.log(a, b);
}

// var就不存在块作用域概念
console.log(b, "b");

// 原因是let声明了a在块作用域
console.log(a, "a"); // ReferenceError: a is not defined