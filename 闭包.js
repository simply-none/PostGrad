/* // 闭包

function outer() {

  var a = 1;

  function inner() {
    console.log(a);
  }

  global(inner);
  // 回调函数大多会有闭包产生
  setTimeout(inner, 1000);
}

function global(fn) {
  // 在一个词法作用域中，
  // 如果未定义使用：ReferenceError: a is not defined
  // console.log(a);
  // 表明了变量的作用域是声明时所在的作用域
  // 而非运行时所在作用域，因为运行时所在作用域为outer，因取不到a，所以得出此结论
  fn();
}

outer()

console.log("ending..."); */


for (var i = 0; i < 3; i++) {
  console.log(this, "for1");
  /**注意若下一条语句是圆括号等其他有歧义的符号，
   * 没有使用分号;将可能和上一条语句连在一起
   * 这里有个坑，而且有点大
   * 
   */


  /**
   * 1. 当程序运行时，iife函数构成了他自己的作用域
   *    由于同步任务比异步任务先完成
   *    所以只能在执行完for循环之后才会执行每个循环内部的定时器回调
   *    此时全局作用域中i === 3，由于回调所处作用域为iife函数，函数没有变量i
   *    则将在全局找变量i，此时i === 3，所以三次都是输出3
   */
  (function iife() {

    setTimeout(function inner_foo() {
      console.log(i)

    }, 0)

  })();

  /**
   * 2. 程序运行时，进入循环后执行iife
   *    执行var j = i;此时iife函数作用域内有变量j
   *    执行定时器（不包括回调函数）
   *    遍历所有循环后，执行回调
   *    由于要输出j，执行RHS查询j的值
   *    当前回调作用域没有变量j
   *    往上级作用域查询（iife作用域），找到j值为i的值（早先赋下的值）
   */
  (function iife() {
    var j = i;
    setTimeout(function inner_foo() {
      console.log(j)

    }, 0)

  })();

  /**
   * 3. 同2，将每次i的值传入iife中，由此j才有值
   */
  (function iife(j) {

    setTimeout(function inner_foo() {
      console.log(j)
    }, 0)

  })(i);


  /**
   * 4. 若不用iife，则运行步骤是循环迭代
   *    将i的值赋给a1
   *    执行定时器（不包括回调，实际上相当于不执行）
   *    然后重复循环赋值，最后a1的值为a1 === 2, i === 3;
   *    开始执行定时器回调，执行RHS查询，当前作用域（回调作用域没有a1）
   *    向上级作用域查询，找到a1 === 2，故全部输出2
   */
  var a1 = i;

  setTimeout(function aa1() {
    console.log(a1, "a1");
  }, 0);

  /**
   * 5. 达到了闭包的效果，let
   */
  let a2 = i;

  setTimeout(function aa2() {
    console.log(a2, "a2");
  }, 0);



}

for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i, "let for");
  }, 0)
}
