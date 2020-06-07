/**
 * new > 显式 > 隐式 > 默认
 */

/**
 * 显式绑定 vs 隐式绑定
 */

function example() {
  console.log(this.a);
}

var a = "global";

var obj = {
  a: "obj",
  example: example,
}

var obj2 = {
  a: "obj2",
}

// 隐式调用
obj.example();  // obj
// 显式调用：先隐式调用，后显式调用
obj.example.call(obj2); // obj2

/**
 * 默认绑定 vs 隐式绑定
 */

// 默认绑定
example();  // node是undefined，chrome是global
// 隐式绑定
obj.example();  // obj


/**
 * 隐式调用 vs new
 */

function example2(a) {
  this.a = a;
  console.log(this.a);
}

var obj3 = {
  example2: example2,
}

// 隐式调用
obj3.example2("obj3");  // obj3
// new调用： 先隐式调用，然后new调用
var new1 = new obj3.example2("new1"); // new1

/**
 * 显式调用 vs new
 */

// 显式调用
var obj4 = obj3.example2.bind(this);
obj4("obj4");   // obj4
// new调用 ：先显式，后new
var new2 = new obj4("new2");    // new2