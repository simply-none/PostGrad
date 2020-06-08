/**
 * 
 * original_link: https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md
 * first_end_time: 2020/06/08 00:03:42
 */

/**
 * 当以前的版本不能实现某语法时，在MDN每个知识点末尾有一个ployfill语法兼容旧环境
 */


/**
 * for..in：遍历一个对象除symbol以外的可枚举属性名(包括继承的)，数组则为下标
 * for..of：在一个可迭代对象创建一个迭代循环，调用自定义迭代钩子，获取每个属性的值
 */

/**
 * yield函数
 * yield关键字：在生成器函数中执行yield表达式，生成器函数遇到yield则暂停，同时yield本身是没有返回值的（undefined）
 *       注意🥯🥯🥯：同时生成器函数的next方法：g.next(args)带的参数作为上一个yield语句的返回值
 * yield*关键字：在生成器函数中执行另一个生成器函数或可遍历的对象/数组
 * 生成器函数：function* fn() {}
 * 
 * 
 * 普通对象默认是不可迭代的，若要使得对象可迭代，需要实现@@iterator方法，即需要添加迭代器定义迭代规则，让其返回一个生成器对象
 * 🍰🍰🍰内置可迭代对象🍰🍰🍰：String、Array、TypedArray、Map、Set、arguments
 * 
 * 迭代对象的方式：iteratorObj.next() // 类似得到：{ value: "h", done: false }
 * 
 * 迭代生成器：（以后看）
 */


// next用法
function* startGame() {
  const 答案 = yield "Do you love JavaScript?";
  if (答案 !== "Yes") {
    return "Oh wow... Guess we're gone here";
  }
  return "JavaScript loves you back ❤️";
}

const game = startGame();
// game.next().value and game.next("Yes").value
console.log(game.next().value /* 1 */); // Do you love JavaScript?
console.log(game.next("Yes").value /* 2 */); // JavaScript loves you back ❤️

// symbol属性
const info = {
  [Symbol('a')]: 'b'
}

console.log(info)   // 🍋🍋🍋{ [Symbol('a')]: 'b'}🍋🍋🍋
console.log(Object.keys(info))    // 没有可遍历属性，返回空数组[]

// 可迭代的对象
const person = {
  name: "Lydia Hallie",
  age: 21,
  *[Symbol.iterator]() {  yield* Object.values(this) }   // 返回一个值的数组
}

console.log([...person])



// yield区别
function* generatorOne() {
  yield ['a', 'b', 'c'];
}

function* generatorTwo() {
  yield* ['a', 'b', 'c'];
}

const one = generatorOne()
const two = generatorTwo()

console.log(one.next().value)   // ['a', 'b', 'c'];
console.log(two.next().value)   // 'a'

/**
 * 函数默认参数：fn(p = p1)
 *    若传入的参数与函数参数类型不匹配（比如一个数组传给一个参数对象）或者没有传入参数，则该函数的参数值为undefined
 */

const add = x => x + x;

// value = add(num)中，没有传入第二个参数时，将使用该作用域下的add(num)函数，
// 此时可能会改变某些值，比如当value的默认参数是一个数组时，可在该函数内部改变数组的值，
function myFunc(num = 2, value = add(num)) {
  console.log(num, value);
}

myFunc();
myFunc(3);

/**
 * 对象冻结方法（都是浅冻结：当对象属性是一个对象时，嵌套的对象不会被冻结，还可被修改，但不能重新赋值）：freeze, 不能添加，修改，删除
 *  seal: 可以修改对象 
 */

/**
 * Proxy对象：
 * 
 */

const handler = {
  set: () => console.log("Added a new property!"),
  get: () => console.log("Accessed a property!")
};

const person = new Proxy({}, handler); // 第一个参数作为person的值，第二个参数是对象的自定义行为，表示设置和获取对象属性时的操作

person.name = "Lydia";
person.name;

/**
 * 导入导出；
 *    导入的模块是只读的，所以不能对其进行修改
 */

// sum.js
export default function sum(x) {
  return x + x;
}

// index.js
import * as sum from "./sum"; // 使用*号，将导入文件中所有值（默认和具名）
// 上面将导入下面的内容（相当于一个对象），故而使用sum.js的sum：sum.default(19)
sum = {
  default: function sum(x) {
    return x + x
  }
}

/**
 * 
 * 🥀🥀🥀promise: 表示一个异步操作的最终完成/失败，及其结果值
 *    1. promise链式调用中，前面的返回结果将作为后面链式函数的参数，返回一个与原来不同的新的Promise，故而🌴🌴🌴promise注意要有返回值（否则将导致链式调用会并行执行）
 *    2. then方法的参数是可选的，当无成功回调时，需显式设置为null：then(success_callback, failure_callback)，回调可以使用箭头函数
 *    3. Promise链每个部分一定要有返回值，否则无法传递给链中的下一个调用
 *    4. catch方法：回调失败，当链式中遇到异常时，将寻找下一个reject失败回调函数（failure_callback）或catch方法，调用该方法后，并且还会继续执行链式调用
 *    
 *    5. Promise被拒绝时，会将（rejectionhandled，unhandledrejection）这两个事件派发到全局作用域中
 *        rejectionhandled：Promise被拒绝，提供了reject的函数调用，在处理完reject函数调用后处理该事件
 *        unhandledrejection：Promise被聚焦，未提供reject的函数调用，会派发该事件
 *        
 *        注：这两个事件都有两个属性（promise, reason)：表示驳回的promise和驳回的原因
 *            可通过上述事件对Promise拒绝时提供补充处理，有利于调试
 * 
 *    6. Promise.resolve()和Promise.reject() ：手动创建一个已经resolve或reject的Promise快捷方式
 *    7. Promise.all()和Promise.race()：并行运行异步操作的两个组合工具
 *    8. 为了避免意外，即使一个已经resolve状态的Promise.resolve()，传递给then也会被异步调用
 *    9. 记得使用catch捕获意外的错误发生
 *    10. Promise能够让异步方法像同步方法那样返回值
 * 
 * 构造：new Promise(function executor(resolve, reject) {...})   
 *      构造函数会立即调用executor函数，若该函数内部抛出错误，Promise状态将变为rejected
 *      executor的返回值被忽略
 * 
 * 构造属性：
 *    Promise.length：构造器参数数目，总是返回1
 *    Promise.prototype：构造器原型
 * 
 * 构造器方法：
 *    ⚡Promise.all(iterable)：用于处理多个Promise对象的集合，iterable是一个可迭代对象
 *         注意：1️⃣若iterable是一个空的可迭代对象，返回同步的已完成（already  resolved）状态的Promise（🥟🥟🥟仅当为空迭代时就是同步，就会之间变成resolved状态，其他的均是异步状态）
 *              2️⃣若iterable没有任何Promise（一个promise都没有的情况下，此时和3️⃣的结果相同的，都是pending），返回一个异步完成（asynchronously resolved）状态的Promise
 *              3️⃣其他情况下返回一个处理中（pending）状态的Promise（异步）
 * 
 *              只有在iterable参数对象里所有的Promise对象都成功时才触发成功，返回一个新的Promise对象
 *              当iterable有任何一个Promise失败，则触发该Promise对象的失败调用
 * 
 *    ⚡Promise.race(iterable)：当iterable里任何一个子Promise被成功/失败后，就会立即返回这个成功值/失败详情作为新Promise绑定的句柄
 *          注意：返回值是一个处理中（pending）的Promise（🛑🛑🛑异步的）
 *                若传递的迭代是空的，则一直等待（pending）
 *                迭代包含了非Promise值和promise值，将返回迭代中找到的第一个值（🎨🎨🎨执行的最快的一个迭代中的返回值，见下面同标志的例子🎨🎨🎨）（不管是Promise还是not Promise）
 * 
 *    ⚡Promise.reject(reason)：返回一个状态为失败的Promise对象，并将给的失败信息（reason）传给对应的处理方法（链式下一个then调用error方法/catch）
 * 
 *    ⚡Promise.resolve(value)：返回一个解析后的Promise对象，将Promise对象多层嵌套展平👑👑👑
 *          注意：若value值为Promise对象，则返回这个对象
 *                若该值是一个thenable对象（含有then方法），则返回的Promise跟随该对象的最终状态
 *                若以上都不是，则直接返回该值的Promise
 *                ❌不要在thenable上调用Promise.resolve()，这将导致无限递归
 * 
 * Promise原型方法：
 *    🔔Promise.prototype.catch(onRejected(reason))：处理拒绝的情况，并返回新的Promise(等同于Promise.prototype.then(undefined, onRejected))
 *          注意：onRejected抛出错误/返回本身失败的promise，则返回的Promise被rejected，否则将显示resolved。catch之后还可进行链式调用
 * 
 *    🔔Promise.prototype.then(onFulfilled(value), [onRejected(reason)])：
 *          注意：若then的回调函数中：
 *                  返回一个值：Promise变为resolve状态，该值作为该状态的回调函数的参数
 *                  没有返回任意值：Promise变为resolve状态，undefined作为该状态的回调函数的参数
 *                  抛出错误，变为rejected状态，错误作为回调的参数
 *                  返回一个resolve的promise，则then返回的promise也作为resolve状态，该promise的resolve状态的回调的参数作为then返回的Promise的接受状态的回调函数参数值
 *                  返回一个拒绝状态的promise，then返回的和她一样
 *                  返回一个待处理状态的promise，then返回的和她一样
 *    🔔Promise.prototype.finally(onFinally)：返回一个promise，无论状态是fulfilled还是rejected，都会执行该回调
 * 
 *          注意：与Promise.resolve(2).then(() => {}, () => {}) （resolved的结果为undefined）不同，Promise.resolve(2).finally(() => {}) resolved的结果为 2。
 *                Promise.reject(3).then(() => {}, () => {}) (resolved 的结果为undefined), Promise.reject(3).finally(() => {}) rejected 的结果为 3。
 * 
 * 
 * 🧊🧊🧊当有多个异步，同步任务在多个函数中时
 * 1. 执行整体代码脚本（promise中第一个参数回调也是同步任务，因为promise的异步体现在它的方法then，catch等内部）
 * 1.0：若promise回调resolve参数是一个thenable（1个微任务），是一个promise实例（2个微任务），就会跳出promise链
 *      注: 🥂同步任务也是宏任务🔴，🌉同步任务都在主线程上执行，形成一个执行栈，其中遇到异步任务就放到不同的任务队列中等待】
 *          🥂💥💥async/await本身是一个promise+generator的语法糖，【其中async函数返回一个promise】  ，await是一个让出线程的标志：
 *                  💥：1️⃣：此时会将await所处的语句执行一遍
 *                      2️⃣：💌然后将await语句后面的所有代码语句放到微任务队列中，跳出async函数执行后面的代码🔴
 *  1.1：Promise.resolve()是会返回一个值的（resolve状态）
 *  1.2：Promise的三种状态pending（待定的，pending），resolve（解决的，fulfilled），reject（拒绝的，rejected）
 * 2. 执行代码中所有的微任务（promise.then/catch/finally， process.nextTick（node中才有），MutationObserver（浏览器才有）【微任务队列】
 *        注：执行微任务时，也是执行整个微任务所属作用域的代码，先执行同步任务，然后判断异步任务并分类
 * 3. 执行代码中所有的宏任务（定时器，I/O操作，UI交互事件，setImmediate（node中才有），postMessage、MessageChannel，requestAnimationFrame（页面重绘前执行的操作，浏览器才有），整体代码也属于一个宏任务✅）【任务队列】
 *        注：执行宏任务时，也是执行整个宏任务所属作用域的代码，先执行同步任务，然后判断异步任务并分类
 * 4. 反复重复1-3步骤（⭐此时步骤1的整体代码脚本广义上来说相当于属于宏任务作用域范围的代码
 * 
 *      注：🛑执行完一个宏任务之后，紧接着执行该宏任务里面的微任务，然后继续从任务队列中执行下一个宏任务
 *                    执行过程中，遇到一个宏任务，就放在任务队列末尾，遇到一个微任务就放到属于该宏任务的微任务队列末尾
 *                    微任务队列：不同的宏任务有不同的微任务队列，执行完宏任务之后立即执行它所属的微任务队列
 * 
 *      参考：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7
 *            https://juejin.im/post/5c3cc981f265da616a47e028#comment（此链接由于版本不同结果不一样，按照笔记判断即可）
 * 
 *      警告：🔴若promise回调中resolve(thenable)：则这里会有一个微任务，创建一个PromiseResolveThenableJob(一个微任务)处理这个thenable.then()（暂停此处的promise链，执行后面其他代码）
 *                   🔴若promise回调中resolve(promise实例)：则这里创建一个会有2个微任务，先创建一个PromiseResolveThenableJob处理这个promise实例，第二个微任务是promise的then回调再次创建一个微任务（此时暂停第一个微任务就跳出promise链，执行promise链后面的其他代码
 *                   thenable：指的是含有then方法的对象，
 * 
 * 
 */


// 2️⃣：💌
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('async1 end');
}

// 等价于

async function async1() {
	console.log('async1 start');
	Promise.resolve(async2()).then(() => {
                console.log('async1 end');
        })
}

// 👑👑👑 starting
// 使用静态Promise.resolve方法
Promise.resolve("Success").then(function(value) {
  console.log(value); // "Success"
}, function(value) {
  // 不会被调用
});
// resolve数组
var p = Promise.resolve([1,2,3]);
p.then(function(v) {
  console.log(v[0]); // 1
});

// Resolve一个thenable对象
var p1 = Promise.resolve({ 
  then: function(onFulfill, onReject) { onFulfill("fulfilled!"); }
});
console.log(p1 instanceof Promise) // true, 这是一个Promise对象

p1.then(function(v) {
    console.log(v); // 输出"fulfilled!"
  }, function(e) {
    // 不会被调用
});
// 👑👑👑   ending



// 🎨🎨🎨
var p1 = new Promise(function(resolve, reject) { 
  setTimeout(resolve, 500, "one"); 
});
var p2 = new Promise(function(resolve, reject) { 
  setTimeout(resolve, 100, "two"); 
});

Promise.race([p1, p2]).then(function(value) {
console.log(value); // "two"
// 两个都完成，但 p2 更快
});

// 
console.log(Promise.resolve(2)) // 2

// 输出：1， 5，（111）， 2，（222）， 3， 4， 6，（333）

new Promise(resolve => { // 1️⃣判断1. 同步任务-----------------执行1：执行promise的回调（），输出【1】
  console.log(1);
  resolve()
}).then(res => { // 2️⃣判断2. then为异步任务-微任务，放到微任务队列中(1)，后续内容不再判断和执行---------执行3：输出【2】
  console.log(2);
  setTimeout(() => console.log(6), 1); // 7️⃣判断5：定时器为异步任务-宏任务，放到宏任务队列中(2)-----------执行6：输出【6】
}).then(res => {
  console.log(3) // 8️⃣判断6：then为异步任务-微任务，放到微任务队列中(2)---------------执行4：输出【3】
});
setTimeout(() => console.log(4), 1); // 3️⃣判断3. 定时器为异步任务-宏任务，放到宏任务队列中(1)------------执行5：输出【4】
console.log(5); // 4️⃣判断4. 同步任务----------------执行2：输出【5】

// 判断是上面的最后一个then先执行还是下面的then先执行
new Promise(resolve => { // 5️⃣判断4----1（后续添加的promise. 同步任务-----------------执行2----1：执行promise的回调（），输出【111】
  console.log(111);
  resolve()
}).then(res => { // 6️⃣判断4----------2. then为异步任务-微任务，放到微任务队列中(1-----1)，后续内容不再判断和执行---------执行3------1：输出【211】
  console.log(222);
  setTimeout(() => console.log(333), 1); // 9️⃣判断6--------1：定时器为异步任务-宏任务，放到宏任务队列中(2-----1)-----------执行6-----1：输出【333】
})


// promise：❌❌❌不懂❌❌❌
// 异步方法始终返回一个promise，
// await需要等待promise的解决
async function getData() {
  return await Promise.resolve("I made it!");
}

const data = getData();   // 返回一个挂起的promise，状态为pending
// 返回该值，需使用then方法
console.log(data);    // Promise {<pending>}

/**
 * 将一个对象赋值给另一个对象，这两个对象指向同一个内存地址，相互会受影响
 */

class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
  }
}

const counterOne = new Counter(); // 创建一个对象
counterOne.increment();
counterOne.increment();

const counterTwo = counterOne; // 将对象的引用赋值给counterTwo（引用地址，counterOne和counterTwo指向同一块内存空间）
counterTwo.increment();

console.log(counterOne.count);

/**
 * Array.prototype.flat([depth])：数组扁平化，即将嵌套数组的层次降低（二维数组-> 一维数组等，三维数组 -> 一维数组），其中depth表示扁平化的深度（默认为1）
 */

/**
 * const声明的变量在声明之前不可调用，会发生referenceError，这称为【暂时性死区】
 * 暂时性死区含义🥠🥠🥠：在作用域最开始到let/const声明的这个区域叫暂时性死区，【start，let/const variable declare】
 *    程序流程在新的作用域中进行实例化时，该作用域内的let/const声明的变量会先在作用域中创建，但由于未进行词法绑定，所以不能被访问（访问报错）
 * 
 * const/let声明的变量将只能在该块作用域中使用，超过使用范围将报错
 * 
 * 
 * 各种错误发生的情形：
 * 
 * 1. EvalError：与eval有关
 * 2. InternalError：引擎内部错误：如递归太多（未标准化）
 * 3. RangerError：数值变量/参数超出有效范围：数组长度为负数，Number对象的方法参数超出范围，函数堆栈超出最大值
 * 4. SyntaxError：解析代码时发生的语法错误
 * 5. ReferenceError：引用一个不存在的变量，将一个值分配给一个无法分配的对象（对函数的运行结果或this赋值）
 * 6. TypeError：变量/参数不是预期类型发生的错误：对原始类型数据使用new，调用对象不存在的方法
 * 7. URIError：URI相关函数参数不正确，主要是encodeURI,decodeURI,encodeURIComponent,decodeURIComponent,escape,unescape
 */


// 1

(() => {
  // 步骤1：先是y = 10;隐式赋值默认在全局作用域创建一个变量y
  // 步骤2：再是let x = y; iife立即调用函数表达式是一个块作用域，x是块作用域的，外部无法访问
  let x = (y = 10);   
})();

console.log(typeof x);    // 不存在的变量和未赋值的变量 值为undefined
console.log(typeof y);    // number

 // 2
function checkAge(age) {
  if (age < 18) {
    const message = "Sorry, you're too young."    // 只能在if块中使用
  } else {
    const message = "Yay! You're old enough!"     // 只能在else块中使用
  }

  return message      // referenceError
}

console.log(checkAge(21))


/**
 * Number.isNaN(value): 确定传进来的value是否是NaN，并且类型是否是Number类型，参数不会自动转为数字
 * isNaN(value): 先将value转为Number类型（使用Number()方法强制转换），判断是否为NaN
 *  1. 当value值是NaN，undefined，{}， new Date().toString()等将返回true
 *  2. 当value值是' '=> 0, '' => 0, null => 0, [] => 0, true => 1, new Date() => 毫秒数, [只含有一个数字/可转为数字的字符串] => 该数字
 */

/**
 * 对语言敏感的格式化数字的构造器类 =》 返回特定的数字格式：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 * new Intl.NumberFormat([locales [, options]])
 * Intl.NumberFormat.call(this [, locales [, options]])
 *  locales：表示某种语言简称，如英语，中文
 *  options：一个对象，可包含以下属性
 *    1. localeMatcher：使用的语言环境匹配算法，如"best fit", "lookup"
 *    2. style: 格式样式，decimal（纯数字，默认），currency（货币格式），percent（百分比格式），unit（单位格式化）
 *    4. currency：货币单位，USD,EUR,CNY
 *    6. unit：各种单位
 */

/**
 * 🍂🍂🍂运算符优先级🍂🍂🍂：从高到低（n/a表示不相关，r表示从右到左，不标明表示从左到右）
 * 20：圆括号（n/a）
 * 19：成员访问（a.b,a[b]），new（带参数的，n/a），函数调用fn(...)，可选链（?.）
 * 18：new（无参数，r）
 * 17：后置自增/自减（...++, ...--，n/a）
 * 16：逻辑非（!..），按位非（~..），一元加/减（+.., -..），前置自增/自减（++.., --..)，typeof.. ，void.. ，delete.. ，await..，（全部是r）
 * 15：幂（.. ** .. ，r）
 * 14：乘/除/取模（ ..*.., ../.., ..%..）
 * 13：加/减（.. + .., .. - ..）
 * 12：按位左移/右移，无符号右移（.. << .., .. >> .., .. >>> ...）
 * 11：小于/大于/小于（大于）等于（.. < .., .. > .. , .. <= .. , .. >= ..），.. in ..， .. instanceof ..
 * 10：等于，非等于，全等于，非全等于（ .. == ..， .. != ..， ... === ... ， ... !== ...）
 * 9：按位与（.. & ..）
 * 8：按位异或（.. ^ .. ）
 * 7：按位或（.. | ..）
 * 6：逻辑与（.. && .. ）
 * 5：逻辑或（.. || ..）
 * 4：条件运算符（.. ? .. : ..，r）
 * 3：赋值（.. = ..，r）
 * 2：（yield ...，yield* ...，r）
 * 1：展开运算符（...，n/a)：（例如... variable）
 * 0：逗号运算符（... , ... ）
 * 
 * 当使用[]成员运算符时，必须要先计算[]里面的值
 * 
 * 展开运算符使用场景：
 * 1. 在函数调用时，将数组或字符串展开并传入到函数参数中（fn(a, b, c), 调用： fn(...[1, 2, 3])或fn(..."123")，形参使用展开的多个参数，实参中使用数组/对象
 * 2. 构造字面量对象/数组时，将对象表达式按key-value展开：
 *      （var a = ["a", ...[1, 2]] => a === ["a", 1, 2]
 *      （var obj = {a: 1, b: 2}, obj2 = {a: 3, d: 4}; mergeobj = {...obj, ...obj2} => {a: 3, b: 2, d: 4};
 * 3. 不能模拟Object.assign()：
 * 4. 在数组/函数参数中使用展开语法，只能用于可迭代对象
 * 5  剩余参数：🍖🍖🍖只能是最后一个形参🍖🍖🍖，后面不能再添加参数（syntax error）表示在函数形参中使用（展开运算符 + 数组/对象），实参中使用多个参数
 * 6. 当使用默认参数时，展开运算符复制的是一个副本，赋值之后的变量不会改变原有对象的值
 * 7. 🥯形参使用展开运算符时，返回实参组成的数组
 * 
 * 
 * 🪐逻辑或和逻辑与：
 *      当操作数是非布尔值时，会返回指定操作数的值，若要返回布尔值，需使用Boolean构造函数或双重非【!!】
 *      两者会发生短路计算：⛔
 *          1. 逻辑或：前面的操作数为真值时，就返回该操作数，否则返回第二个操作数（无论第二个操作数真假）
 *          2. 逻辑与：前面操作数为假值时，就返回该操作数，否则返回第二个操作数（无论第二个操作数真假）
 * 
 *    
 */

// 🥯
function getAge(...args) {
  console.log(typeof args)
}

getAge(21)  // object

// 默认参数
var ff = {
  a: 1
};

function fff(o = {
  ...ff
}) {
  o.a = 4;
  o.b = 5
}

fff() // 当没有传入参数，而使用默认参数时，不会改变原有对象ff，因为参数o每次都会根据默认值创建一个新的变量
fff(ff) // 当传入参数时，会改变该对象

// 展开运算符不能模拟3
var obj1 = {
  foo: 'bar',
  x: 42
};
var obj2 = {
  foo: 'baz',
  y: 13
};
const merge = (...objects) => ({
  ...objects
});

var mergedObj = merge(obj1, obj2);
// Object { 0: { foo: 'bar', x: 42 }, 1: { foo: 'baz', y: 13 } }

var mergedObj = merge({}, obj1, obj2);
// Object { 0: {}, 1: { foo: 'bar', x: 42 }, 2: { foo: 'baz', y: 13 } }

const name = "Lydia Hallie";

// 1. 先是typeof name
// 2. !typeof name
// 3. ===
console.log(!typeof name === "object");   // 均为false
console.log(!typeof name === "string");

// 运算符访问方式：
const colorConfig = {
  red: true,
  blue: false,
  green: true,
  black: true,
  yellow: false,
}

const colors = ["pink", "red", "blue"]
// 访问colorConfig对象的colors属性，没有，则返回undefined
// 之后对undefined取第一个元素，抛出typeerror错误
console.log(colorConfig.colors[1])    // typeERROR


/**
 * 可选链操作符：可连用，短路计算，与空值合并操作符一起使用（避免值无意义）
 * obj?.prop
 * obj?.[expr]
 * arr?.[index]
 * func?.(args)
 *  判断（?.）操作符之前的变量/函数是否存在，存在则读取它的属性或进行函数调用，否则返回undefined（当变量为null或undefined时），
 *  与（.）的区别：
 *      1. 🥦（.）操作符当对象的变量不存在时，访问该变量下面的属性比如obj.first.second => typeerror  Cannot read property 'second' of undefined
 *      2. 当对象属性不是函数时，或对象变量不存在，使用函数调用的方式如obj.not_fn() => typeerror  a.b is not a function
 * 
 * 空值合并操作符：（??）：当左边值为null或undefined时，返回右边的值，否则返回左边的值，保证变量值不为null或undefined
 *  注意：不能和&& 或 || 共用
 *        为变量赋默认值
 *        与可选链一起使用
 * 
 */


 // 🥦
const bird = {
  size: 'small'
}

const mouse = {
  name: 'Mickey',
  small: true
}

console.log(mouse.bird.size)    // 这里是查找mouse是否由bird属性，显然没有（不是把上面的bird赋值到这里的，要注意），故值为undefined，undefined没有属性，故抛出type error

 //
const person = {
  firstName: "Lydia",
  lastName: "Hallie",
  pet: {
    name: "Mara",
    breed: "Dutch Tulip Hound"
  },
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};

// B: Mara undefined Lydia Hallie undefined
console.log(person.pet ?.name);
console.log(person.pet ?.family ?.name);
console.log(person.getFullName ?.());
console.log(member.getLastName ?.());


/**
 * Map对象：保存键值对，可记住添加时的顺序(有序)，任何值（包括对象）都可以作为键/值
 * 1. 键的相等判断：只有键相等于才能返回相同的值（基于 === 判断，同时NaN和NaN是相等的，+0和-0是相等的），故而当键为对象时，只有引用相等才能返回相应的值
 * 2. 构造函数：new Map()
 * 3. 方法has(key), set(key, value), get(key), clear(), delete(key); keys(), values(), entries(), map[@@iterator]都返回一个生成器对象(可以遍历), 例子：map[Symbol.iterator]()
 * 
 */


/**
 * Set对象：存储任何类型的唯一值，不管是原始值还是引用值（原始值相等，引用值相等不会重复添加）
 *      语法：new Set([iterable])：参数是数组/可迭代对象，不指定参数/值为null，则新集合为空
 * 
 *      注意：
 *          set对象是值的集合，相同元素只出现一次
 *          相同元素特例：+0和-0在这里是不相等的（es5）但es6已更改，NaN和NaN是相等的
 *          undefined可以存入set中
 * 
 *      构造属性：
 *          Set.size：默认为0
 *          Set.prototype：构造器的原型
 * 
 *      实例属性：
 *          set.size：Set对象的值的个数
 * 
 *      实例方法：
 *          set.add(value)：添加属性到Set对象末尾，返回该对象
 *          set.clear()：清空Set对象
 *          set.delete(value)：删除与value值相等的元素，存在则返回true，否则false
 *          set.forEach(callback(current_value, current_key, set), binding_this)：
 *                为每个值执行回调（其中current_value和current_key相等，set为当前集合，binding_this是调用时绑定的this，默认为undefined）
 *                该方法没有返回值
 *          set.has(value)：判断该值是否在集合中，value必须与集合中的值相等（相等情形看上面的语法）才返回true
 * 
 *          set.entries()：返回一个新的 迭代器对象 ，该对象的元素是[value, value]的数组
 *          set.values()和set.keys()：两方法相等，返回一个值组成的迭代器对象
 */

/**
 * 
 * 通常若对象赋值为null，则会进行垃圾回收
 * 然而定时器的参数是一个箭头函数，它还会保留对config的引用，只要引用存在，对象就不会被垃圾回收
 *      即对对象重新赋值之后（赋值为null），箭头函数保留了对象的引用，故而定时器无法清除
 *      此时需要使用普通函数或具名函数，在重新赋值之后，可以用定时器清除：clearInterval(config.alert)
 *      
 *      若对象属性的值是一个箭头函数，则它里面的this指向全局作用域（箭头函数的this是指向离他最近的词法作用域的）
 * 
 * 若对象没有重新赋值，是可以直接调用clearInterval(intervalID )清除定时器的，不管参数是否是箭头函数
 */

// 定时器还是会每隔一秒执行
let config = {
  alert: setInterval(() => {
    console.log('Alert!')
  }, 1000)
}

config = null


/**
 * 
 * WindowOrWorkerGlobalScope：window对象和WorkerGlobalScope接口的混合 特性：
 * 
 * 定时器：
 * 
 * 🥏setTimeout：返回一个定时器编号的正整数，可以传递给clearTimeout清除定时器
 *      构造：setTimeout(function[, delay, [arg1, arg2....]])：其中arg1/2是function的参数
 *            setTimeout(code, delay)：code是待执行的字符串（不推荐）
 *      注意：省略delay或设置为0，实际的延迟时间将比这要长（有一个最小延迟时间）
 *            参数回调中this的指向，如果直接是一个函数，则this指向全局（严格模式指向undefined，严格模式可能也指向全局）
 *            要使this指向回调被调用的对象，
  *              可使用嵌套函数（普通函数或箭头函数里面嵌套一个原先要调用的函数）
  *                setTimeout(() => {obj.method()}, 10000)
  *              使用call：setTimeout.call(obj, obj.method, delay, arg1..)
  *              使用bind：setTimeout((obj.method).bind(obj), delay, arg1..)
  *           在回调参数中传入字符串代码时，字符串将在全局作用域内被执行（之后在该字符串声明的变量将保留在全局作用域中）
  * 
  *           最小延迟时间（>=4ms）：
  *                 浏览器每调用一次定时器的最小间隔是4ms，通常由函数嵌套导致的，或者是回调函数阻塞导致
  *                 未被激活的tabs定时最小延迟> 1000ms：为了优化后台tab的加载损耗
  * 
  *           超时延迟：同步任务，异步任务队列类似（由于当前页面被其他任务占用导致）
  * 
  * 🥏clearTimeout(timeoutID)：取消了先前通过调用setTimeout() 建立的定时器
  *     注意：timeoutID通过调用setTimeout调用返回
  *           传入一个错误的ID给该函数不会有任何影响，也不会抛出异常  
  * 
  * 🥏setInterval：返回一个非零的数值ID
  *     构造：setInterval(function[, delay, [arg1, arg2....]])：其中arg1/2是function的参数
 *            setInterval(code, delay)：code是待执行的字符串（不推荐）
 * 
 *  🥏clearInterval(intervalID)：可取消先前通过 setInterval() 设置的重复定时任务。
  * 
  *  
  * 编码解码：
  *   btoa(string)：从String对象创建一个base-64编码的ascii字符串（每个字符视为一个二进制字节），返回一个base64表示的字符串
  *   var encoded_data = btoa(string_to_encode);
  *       btoa(unescape(encodeURIComponent(str)))：将任何字符转为ascii
  *       decodeURIComponent(escape(window.atob(str)))：解码
  *   atob(encodedData)： 对经过 base-64 编码的字符串进行解码。
 *            
 *    
 */


/**
 * 模板字符串：使用反引号引起的字符串，允许嵌入表达式，可使用多行字符串/字符串插值
 * 嵌入变量或表达式使用：${...}
 * 
 * 带标签的模板字符串：定义一个标签函数，其中第一个参数为包含字符串值的数组，其余参数与表达式有关
 * 第一个参数：数组：被插值分隔的字符串数组，若插值在开始或末尾，会分隔一个空字符串
 * 第二、三、...个参数：第一/二/...个插值表达式的值
 */

var a = 1,
  b = 3;
console.log(`Fifteen is ${a + b} and
not ${2 * a + b}.`);

// 标签模板字符串：
function tagMod(str, param1, param2) {
  console.log(str, param1, param2);
}

//  ["my name is ", " and age is ", "", raw: Array(3)] "xia" 23
tagMod `my name is ${"xia"} and age is ${23}`

/**
 * JSON对象：
 * 特性： 
 *    1. 属性名必须使用双引号引起，最后一个属性后面不能有逗号
 *    2. 属性值不能为前导0，即数字前面不能添加一个0，否则parse会抛出语法错误
 * JSON.parse()：解析json字符串，构造由字符串描述的JavaScript值或对象，最末尾不允许使用逗号结尾（在数组内部/对象内部）
 * 
 * JSON.stringify(value, [replacer, [space]])：将JavaScript值（对象/数组等）转为一个JSON字符串
 *    注意：1. 若值为undefined，函数，symbol值，将被忽略（作为非数组对象的属性值时），或者为null（数组中）
 *          2. 若单独转换函数，undefined，返回undefined
 *          3. symbol属性的键被忽略
 *          4. date将转为字符串
 *          5. NaN，infinity，null转为null
 *          6. 仅序列可枚举属性
 *          7.若replacer是数组，则只有在该数组列出的属性才会被返回，为null或未提供，返回所有
 *          8. 若replacer是函数，序列化过程中，序列化的每个属性都会经过该函数的处理转化
 *          9，指定缩进的空白字符串（美化输出），参数为数字，代表空格数（最大为10），小于1则无空格，若为字符串，则填充字符串
 */


/**
 * 数组对象：
 * 
 * 修改器方法：会修改原数组
 * pop：返回删除的元素，push：返回数组的长度
 * shift：返回删除的元素，unshift：返回数组长度
 * reverse：返回更改后的数组，sort(fn)：返回更改后的数组，splice(start_index, delete_count, add_item1, add_item2...)：返回删除的元素组成的数组
 * 
 * 访问方法：不会修改原数组
 * 
 * 返回新数组：
 * concat(value1, .....)：数组连接：其中参数可为数组（浅拷贝，若修改原数组中某个对象元素的属性，会更改原数组，但不可将对象重新赋值）/值
 * slice(start_index, [end_index])：切割数组（浅拷贝），索引可为负数，开始索引位置比结束索引位置小
 * 
 * join(separator)：返回字符串
 * toString(), toLocaleString()：返回字符串
 * indexOf(search_element, start_index)：返回索引/-1， lastIndexOf()
 * 
 * 迭代器方法：若在回调中添加属性则不被遍历，也不要在回调中修改原数组（可读和可维护的原因）
 *      注意：🧃🧃🧃【迭代器方法被调用时，不会改变原数组】🧃🧃🧃，但是它的回调函数可能会改变原数组（例如可以使用array[index] == ...来改变）
 * 
 * filter(callback(current_value, index, array), binding_this)：若元素的回调返回真值，则返回由这些元素构成的新数组
 * 
 * map(callback(current_value, index, array), binding_this)：返回一个由原数组每个元素执行的回调 的返回值 的数组（会忽略掉未赋值的元素）
 * 
 *    案例：[1, 2, 3].map(parseInt)  => [1, NaN, NaN]
 *    分析：[1, 2, 3].map(parseInt(string, radix) {return parseInt(string, radix)})
 *          其中radix为一个进制位，string执行：Number(string)，且会将BigInt转换为Number类型
 *          当radix值为undefined，0或未指定时，
 *              输入的字符串以0x或0X开头，解析为十六进制
 *              以0开头，假定为十进制（es5默认的，但不是所有浏览器都是）或八进制
 *              以其他数值开头，默认为10进制
 *        1. parseInt(1, 0, array) { return 1};
 *        2. parseInt(2, 1, array) {return NaN};
 *        3. parseInt(3, 2, array) {return NaN};
 * 
 * reduce(callback(accumulator, current_value, [index, array, initial_value]))：回调函数累计处理的结果（累加结果，🍦🍦🍦需要有返回结果，返回的结果存到accumulator中））
 *    注意：其中accumulator为累加器，当initial_value为空（直接跳过索引0，执行索引1处回调），则取值第一个元素的值，current_value取第二个元素的值，不为空取initial_value的值，current_value取第一个元素的值（不执行回调）
 *          数组为空，且无initial_value，抛出typeError
 *          仅有一个元素，无initial_value，返回该唯一值
 *          
 * 
 * forEach(callback(current_value, [index, [array]]), binding_this)：每个元素执行一次回调，其中binding_this为绑定的this
 *      注意：forEach被调用时，不会改变原数组，但是它的回调函数可能会改变原数组（例如可以使用array[index] == ...来改变）
 * 
 * every(callback(value, index, array), binding_this)：若每一个元素执行的回调都返回truthy（除了null，undefined，false，0，'', NaN之外的）值，则返回true
 *      注意：若被空数组[]调用，则永远返回true
 * 
 * some(callback(value, index, array), binding_this)：至少有一个元素执行的回调返回truth，则返回true
 *      注意：空数组永远返回false
 */


/**
 * 引用：在参数中，若引用的对象相同，则两者相等
 * 函数参数可以是任意个，形参和实参不需要对等，同时若形参数量多余实参，则没有赋值的形参值为undefined
 */

function compareMembers(person1, person2 = person) {
  if (person1 !== person2) {
    console.log("Not the same!")
  } else {
    console.log("They are the same!")
  }
}

const person = { name: "Lydia" }

compareMembers(person)  // They are the same!

/**
 * 箭头函数：当箭头函数只返回一个值时，可不用{}，当要返回一个对象时，必须使用()将对象括起来，否则会有语法错误
 *    
 * 
 */

const getList = ([x, ...y]) => [x, y]
// const getUser = user => { name: user.name, age: user.age }    // syntaxError   Unexpected token ':'
// 正确形式：const getUser = user => ({ name: user.name, age: user.age })

const list = [1, 2, 3, 4]
const user = { name: "Lydia", age: 21 }

console.log(getList(list))
console.log(getUser(user))


/**
 * 断句：🍻🍻🍻JavaScript不必显式写出分号🍻🍻🍻，引擎会在语句之后自动添加分号（自动分号插入）
 * 语句：可以是变量、throw、return、break等，只要能构成表达式的内容都可以是语句（不写分号）
 */

function nums(a, b) {
  if
  (a > b)
  console.log('a is bigger')
  else 
  console.log('b is bigger')
  return      // 该句相当于return ;
  a + b       // 不执行
}

console.log(nums(4, 2))
console.log(nums(1, 2))


/**
 * Object对象：
 *    1. 对象由属性名和属性描述符构成
 *    2. JavaScript中的所有对象都来自 Object；
 *    3. 所有对象从Object.prototype继承方法和属性，尽管它们可能被覆盖。
 *    4. 某些构造函数的原型将覆盖 constructor 属性并提供自己的 toString() 方法。
 *    5. 🎏给字面量对象添加属性时，属性名(键名）将自动转为字符串类型 =》 a = {value: 1};b = {}; b[a] = 123; b => {'[object Object]': 123}
 *    6. 🎁字面量对象赋值时，若有多个相同键名，则键名的值会被覆盖，但是键的位置还是第一次出现的位置
 *    7. 🎫所有对象的键名都是字符串形式，即使显式来看并不是这样（会自动转为字符串），obj.hasOwnProperty(value)中的value也是一样会转为字符串形式
 * 
 * 构造：
 *    1. 字面量： {key1: value1, ...}
 *    2. 构造函数：new Object(value)或Object(value)：value可以是任意的值，若传入多个值，只取第一个（🥙🥙🥙JavaScript可以传入任意个参数🥙🥙🥙）
 * 
 * 构造函数的方法：
 * Object.assign(target, ...sources)：将所有可枚举属性的值从源对象复制到目标对象，返回目标对象
 *      注意：从参数顺序，后来的会覆盖先来的（在源对象内部也是这样）
 *            只会拷贝源对象自身可枚举的属性（使用源对象的[[Get]]和目标对象的[[Set]]，将属性定义复制到原型，🥝🥝🥝String和Symbol类型也会被拷贝🥝🥝🥝，应该使用getOwnPropertyDescriptor()和defineProperty()
 *            拷贝的属性不可写，将引发TypeError，该错误之前的属性将被添加
 *            继承的和不可枚举的属性不会拷贝
 *            原始类型拷贝时会转为包装对象，所以可以Object.assign({}, null, undefined, 12, "abc", )，其中只有字符串是可枚举的
 *      使用场景：复制一个对象，合并对象，拷贝属性名为Symbol类型的属性
 *                深拷贝：JSON.parse(JSON.stringify(obj1))
 * 
 * Object.create(proto, [propertiesObject])：创建一个新对象
 *      注意：proto为新对象的原型（一个对象，可为null）
 *            创建一个最空的对象：Object.create(null); 或者是obj.__proto__ = null;
 *            propertiesObject表示新对象自身添加的属性对象（值，可枚举，可配置，可写，set，get等）,对应defineProperties第二个参数
 * 
 * Object.defineProperty(obj, property_name, property_descripter)：定义属性（新的/旧的），返回该对象（🍓🍓🍓见下面例子🍓🍓🍓）
 *      注意：🍀🍀🍀默认添加的属性是不可枚举的
 *          可枚举属性为true表示：可以使用for...in或Object.keys方法
 *          六个属性描述符不能同时使用：只有下面两种形式：（configurable和enumerable公有）🍳🍳🍳这些属性可能继承自原型🍳🍳🍳
 *              1. 数据描述符：value, writable
 *              2. 存取描述符：get(), set()
 *      Object.defineProperties(obj, property_descripters)：
 *              property_descripters: {"p1": {...}, "p2": {...}, ....}
 * 
 *      Object.getOwnPropertyDescriptor(obj, property_name)： 返回属性描述符对象/undefined（不存在该属性）
 * 
 *      Object.getOwnPropertyNames(obj)：返回自身（非继承的）可枚举的和不可枚举的属性名称的数组（不包括Symbol值）
 *              es5中，若obj非对象，抛出Type Error， es6中强制转为对象
 * 
 *      Object.keys(obj)：返回对象自身可枚举属性的属性名的数组，顺序与遍历时顺序一致
 * 
 *      Object.values(obj)：返回对象自身可枚举属性的属性值的数组，顺序与遍历时顺序一致
 * 
 *      Object.getOwnPropertySymbols(obj)：返回对象自身的symbol属性（名）的数组
 * 
 * Object.entries(obj)：返回obj自身可枚举属性的数组（属性名-属性值数组的数组：[[key, value],...]，排序和for..in一致
 * 
 * Object.getPrototypeOf(obj)：返回obj对象的原型，没有则返回null
 *          es5中，若obj非对象，抛出Type Error， es6中强制转为对象
 * 
 * Object.setPrototypeOf(obj, prototype)：设置原型，若prototype不是对象/null则静默处理
 *        🎨🎨🎨修改对象原型更合适的方法：obj.__proto__ = prototype🎨🎨🎨
 * 
 * Object.is(obj1, obj2)：判断两个值是否相等（不会发生类型转换），返回Boolean值
 *       特殊的相等情况：+0和+0， -0和-0（+0，0和-0不想等）， NaN和NaN，指向同一对象（对象引用相同）
 *      
 * 冻结对象：es5中obj若为原始值，抛出type error，es6则原样输出
 * Object.freeze(obj)： 返回obj（浅冻结，若属性为一个引用，该属性还是可内部修改的）
 *        注意：不能添加，删除，修改属性，
 *              不能修改已有属性的configurable、enumerable、writable、value
 *              不能修改对象的原型
 *              
 * 
 * Object.seal(obj)：不能添加新属性，不能删除属性，数据属性不能修改，但🥎🥎🥎属性值可修改🥎🥎🥎，原型的属性不可修改
 * 
 * Object.preventExtensions(obj)：对象不可扩展，不能添加新的属性，可以删除属性，原型属性可添加,原型的属性可修改
 * 
 * 
 * 
 *    Object.isExtensible(obj): 是否可扩展，是否可添加属性，可扩展时可修改属性和原型的属性
 *    Object.isSealed(obj)：属性不可配置，不可删除，可写
 *    Object.isFrozen(obj): 是否被冻结，所有属性不可配置，所有数据属性不可写
 * 
 * 
 * 实例属性和方法（定义在原型链上的）：
 * 
 * 属性：
 * Object.prototype.constructor：创建对象的原型
 * Object.prototype.__proto__：实例化对象的原型
 * 
 * 方法：
 * Object.prototype.hasOwnProperty(key)：判断对象自身是否有指定的属性
 * Object.prototype.isPrototypeOf(obj)：判断对象是否在obj的原型链中
 * Object.prototype.toString()：返回对象的🍠🍠字符串表示🍠🍠， 对象会返回'[object  type]'的形式，这两者null都不能使用，因为null没有这些属性/方法
 * Object.prototype.valueOf()：返回对象的🍗🍗原始值🍗🍗（date返回毫秒数，Math和Error没有该方法，可以覆盖该方法
 * 
 * 
 * 箭头函数没有prototype属性
 */


// 🎏
const a = {}
const b = { key: 'b' }
const c = { key: 'c' }

a[b] = 123    // a['[object Object]'] = 123
a[c] = 456    // a['[object Object]'] = 456

console.log(a[b])   // 456

// 🎁
const obj = { a: 'one', b: 'two', a: 'three' }
console.log(obj)  // { a: "three", b: "two" }，同时声明两个相同名称的键，键值会被替换掉，但键所处位置还是原先位置，不会被替换

// 🎫
const obj = { 1: 'a', 2: 'b', 3: 'c' }
const set = new Set([1, 2, 3, 4, 5])

obj.hasOwnProperty('1')   // obj['1']  true
obj.hasOwnProperty(1)     // obj['1']   true
set.has('1')              // 是否有某值   false
set.has(1)                // true

// create
var proto_obj = {
  a: 1
}

var proto_new_obj = Object.create(proto_obj, {
  "custom_param": {
    configurable: true,
    enumerable: true,
    // value: "123",
    // writable: true,
    get() {       // 不能和writable或value属性一起使用
      return "get 123";
    },
    set(val) {        // 当设置属性的值时，将调用该方法，且将赋值表达式右侧的值传给val
      this.custom_proterty = val + "hui";
    }
  }
})
console.log(proto_new_obj.__proto__ === proto_obj); // true

// entries
const obj = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]

// getPrototypeOf
Object.getPrototypeOf( Object );               // ƒ () { [native code] }
Object.getPrototypeOf( Function );             // ƒ () { [native code] }

Object.getPrototypeOf( Object ) === Function.prototype;        // true

// Object.getPrototypeOf( Object )是把Object这一构造函数看作对象，
// 返回的当然是函数对象的原型，也就是 Function.prototype。

// 正确的方法是，Object.prototype是构造出来的对象的原型。
var obj = new Object();
Object.prototype === Object.getPrototypeOf( obj );              // true

Object.prototype === Object.getPrototypeOf( {} );               // true


/**
 * 值设置为true/false的方法：使用两次取反：!!value;
 */


/**
 * 纯函数🍷🍷🍷：相同的参数传入，最终得到的输出相同(即相同条件下，在外力作用下也绝对不会改变输出的值)
 */


/**
 * 对象的解构：
 */

// {name: myName}表示创建一个名为myName的新变量，并将name属性的值赋给它
const { name: myName } = { name: "Lydia" }; 

console.log(name);    // referenceerror


/**
 * 字符串：String
 * 
 * str.raw`...`：🍐🍐🍐其中...可能包含模板语法：获取原始字符串，任何转义字符无效，注意，在模板语法(${})中的内容还是会被转义的
 * 
 * str.padStart(target_length, [pad_string])：用字符串pad_string填充到str指定的长度，返回一个新的字符串（对原来字符串无影响）
 *      注意：1. 从字符串最左侧开始填充，当🧃🧃🧃pad_string + 原有长度🧃🧃🧃不足以填充到指定长度，则pad_string循环填充进去，直到填满
 *            2.若目标长度小于当前字符串的长度，返回当前字符串本身
 *           3.  若pad_string长度 + 原有长度 大于可填充的长度，则截取该串的左部填充进去
 */


/**
 * Symbol类型：：
 *    注意：每个symbol类型的值都是唯一的（Symbol("a")和Symbol("a")不相等），它的值不依赖于参数
 */


/**
 * import命令在编译阶段执行，这和require有区别（在运行时按需加载模块）
 */

// index.js
console.log('running index.js');
import { sum } from './sum.js';     // 导入命令在编译阶段执行
console.log(sum(1, 2));

// sum.js
console.log('running sum.js');
export const sum = (a, b) => a + b;
// output：
// running sum.js, running index.js, 3


/**
 * 类Class：
 *    注意：构造器中，继承父类第一行需要使用super关键字，super之前不能访问到this（reference error）
 */


/**
 * JavaScript内存管理：JavaScript在创建变量时自动分配内存，在不使用时自动释放（垃圾回收）
 * 所有语言的内存生命周期：
 *      1. 分配所需要的内存
 *      2. 使用分配到的内存（读写）
 *      3. 释放不需要的内存空间
 * 
 * JavaScript内存分配：
 *      1. 值的初始化
 *      2. 函数调用分配内存
 * 
 * 垃圾回收：
 *      注意：     
 *        垃圾回收算法依赖于对象/对象属性的引用（这里对象还包括函数作用域和全局作用域）
 *        垃圾回收实现只能有限制解决一般问题
 *      算法：
 *        引用计数垃圾收集（早期浏览器）：当没有其他对象 引用 该对象/该对象的属性，将被垃圾回收机制回收
 *            缺点：不能处理循环引用（循环引用不能回收，将导致内存泄漏）
 *        标记-清除算法（现代浏览器）：当对象不能从根对象开始获取时（零引用对象和循环引用对象），将被垃圾回收机制回收
 *            缺点：无法从根对象查到的对象将被清除
 * 
 *      
 * 
 */


// 内存回收
let person = { name: "Lydia" };

// 根据算法，members引用了全局作用域中的person对象
// 故而person不会被回收
const members = [person];
// person赋值为null，即重新创建一个内存空间，丢弃了之前的对象
// 但是members仍然保持之前的引用，所以person 和 members不相等了

// ✅相当于 函数参数赋值的情形，部分改动会互相影响，重新赋值将断开两者之间的关系
person = null;

console.log(members);


/**
 * delete：删除对象的某个属性，没有指向该属性的引用，最终将被释放，window也是一个对象
 *      用法：
 *        delete expression，✅delete obj.property， ✅delete obj['property']（对象属性是一个字符串，这种方式一定要加上引号）
 *      返回值：
 *        所有情况都返回true，但若是一个自身不可配置的属性，非严格模式下返回false，严格模式下type error，🥩🥩🥩不能删除的属性返回false
 *      注意：
 *        删除不存在的属性，返回true，delete不起作用
 *        delete只会删除自身属性
 *        var声明的属性不能从全局/函数作用域中删除，隐式全局（没有标明var的变量）可以删除
 *        不能删除全局作用域的函数，对象中的函数能用delete删除
 *        let/const变量不能从其声明的作用域中删除
 *        不可设置的属性不可删除（non-configurable）：内置对象的属性，使用defineProperty方法设置的属性描述符的configurable为false时不可删除
 *        严格模式下对变量的引用，函数参数，函数名使用delete，将抛出syntaxerror，避免该错误，应使用上述✅的形式
 *      
 *      
 * 
 */


/**
 * new的过程：
 *    当使用new fn()时，若fn有返回值且该值是一个对象，则返回函数返回的对象，否则返回一个新的对象
 */


/**
 * 对象的引用：函数参数传值是赋值传递（非引用，也可说局部引用）：
 *        传入的是原始值，函数内部更改原始值将不会变化
 *        传入的是对象，函数内部分更改对象的属性，则对象会发生变化，若对对象重新赋值，则原对象不发生变化
 */

function getInfo(member, year, other) {
  member.name = "Lydia";
  year = "1998";
  other = {a: 1};
}

var person = { name: "Sarah" };
var other = {a: 2};
var birthYear = "1997";

getInfo(person, birthYear, other);

console.log(person, birthYear);





/**
 * 函数Function：
 * 
 * 实例方法：
 * 🎀bind：创建一个新函数，调用时新函数的this指向第一个参数，其余参数作为新函数的参数
 *      构造：function.bind(binding_this, [arg1, arg2...])
 *      返回值：⛳⛳⛳返回一个原函数的拷贝，并拥有this和预设的初始参数
 * 
 *      使用场景：预设参数，之后可少传递几个参数
 *                配合定时器使用，显式绑定this
 *                通过Array.prototype.slice.bind(arguments)将类数组转为数组
 *                每运行一次返回一个新函数：在监听事件时会产生一些问题
 *                      ele.addEventListener('click', o.m.bind(o))：这里的监听函数生成的是一个匿名函数，此时无法取消监听
 *                      正确使用：listener = o.m.bind(o); ele.addEventListener('click', listener)：这里listener只会运行一次
 *                改写方法：(结合call使用)
 *                      比如数组push方法：var push = Function.prototype.call.bind(Array.prototype.push); push(arr, ele)
 *                                        1️⃣ Array.prototype.push.call(); push(arr, ele)
 *                                        2️⃣ Array.prototype.push.call(arr, ele);
 *                                        3️⃣ arr.push(ele)
 *                      改写bind方法：var bind = Function.prototype.call.bind(Function.prototype.bind); bind(fn, binding_this_obj)
 *                                        1️⃣ Function.prototype.bind.call(); bind(fn, binding_this_obj);
 *                                        2️⃣ Function.prototype.bind.call(fn, binding_this_obj);
 *                                        3️⃣ fn.bind(binding_this_obj);
 *                
 * 🎀apply：提供一个（类）数组，将其内部的元素作为参数列表，并调用这个给定this的函数（执行该函数）
 *      构造：function.apply(binding_this, args_array)
 *      返回值：返回一个指定this和参数的函数结果（执行该函数）
 * 
 *      使用场景：
 *            将一个数组添加到另一个数组：arr.push.apply(arr, push_arr);
 *            找出最大/小值：Math.max.apply(null, arr_list)
 *            将数组的空元素变为undefined：在数组forEach方法中会跳过空元素，但不是跳过undefined
 *            🥠类数组（含有length属性的对象）转为数组：使用原型链的slice方法
 *            
 * 🎀call：使用一个指定的this和多个参数来调用一个函数（执行该函数）
 *      构造：function.call(binding_this, arg1, arg2, ...)
 *      返回值：调用该函数得到的返回值，没有将返回undefined（执行该函数）
 * 
 *      注意：当没什么可指定的this时，非严格模式下，指定null或undefined自动转为全局对象
 * 
 *      使用：允许不同的对象分配和调用属于一个对象的方法
 *            实现继承：super_fn.call(this, arg1, arg2...);
 *            调用匿名函数
 *            使用call但不指定参数，严格模式下this为undefined
 * 
 *      注：🍧🍧🍧bind，apply，call这三个函数：若参数的this值为undefined/null，或者参数为空，则指向全局对象window
 * 
 * 
 */


/**
 * 🧧🧿📢事件传播：捕获阶段（只有侦听器第三个属性设置成true，才有捕获阶段，其他的都是冒泡阶段）---目标阶段----冒泡阶段
 * 
 * 如果每个嵌套元素都定义了侦听器（第三个参数为true则在捕获阶段触发），执行顺序如下：
 *      root-useCapture -- second-level-useCapture -- ... --- target-useCapture --- target bubble(冒泡) ---... --- second bubble --- root-bubble
 * 
 * 
 * 📙📖📗事件：每个可用的事件都有一个事件处理器（事件触发时运行的函数）
 * 
 *      注意：
 *            🥽事件处理三种形式：
 *                行内事件处理：<button onclick="fn()">点击</button>
 *                事件处理属性：ele.onclick = fn
 *                事件侦听器
 *            🛑给同一个监听器注册多个处理器，不能使用ele.onClick = fn的形式（会被覆盖），应该使用事件侦听器
 *            🩳事件对象：他会自动传递给event handler，即事件处理器参数中的event/evt/e，能够提供额外的信息，比如event.target
 * 
 * 事件侦听器：addEventListener(), removeEventListener()
 * 
 * 
 */


/**
 * 🎽Element对象：
 * 
 * 
 * ele.outerHTML：获取/设置ele元素（包括自身、和它的后代）的序列化HTML片段
 * ele.innerHTML：获取/设置ele元素（只包含它的后代）的序列化HTML片段
 *     注意：当HTML未正确标记，设置innerHtml将抛出syntax error
 *          当ele是document时，设置innerHTML将不允许修改（抛出NoModificationAllowedError ）
 * 
 * 
 * ⛳HTMLElement对象：
 * 
 *  💰ele.outerText：非标准属性，返回与innerText一样的值
 * 
 *  💰ele.innerText：表示节点和其后代🎈呈现的文本内容（只显示呈现的文本，内部的样式元素/脚本元素不显示，隐藏元素不显示）🎈
 *      注：若元素本身没有被渲染（从文档中删除/没有在文档视图中显示（还没被添加到文档视图中）），返回值和Node.textContent属性相同
 * 
 *  💰Node.textContent：表示一个节点及其后代的文本内容，返回一个字符串/null
 *      注：若节点是document/DCOTYPE，返回null
 *         节点是注释节点，文本节点 ,CDATA section（xml中）,processing instruction（处理指令），则返回节点内部的文本内容，即Node.nodeValue
 *          其他类型节点，将所有子节点的textContent合并后返回（除了注释和processing instruction），没有子节点返回空字符串
 * 
 *      两者区别💰💰：
 *          textContent会获取所有元素的内容，包括script和style元素，innerText只获取展示的内容
 *          textContent会返回节点的每一个内容（不管是否隐藏，display），innerText不会返回隐藏的文本，但会触发回流确保内容是最新的样式（这就像要判断display一样，当其值是none时，就不会显示该元素了）
 *          在ie11-版本中，修改innerText会移除  当前元素子节点，同时还会永久破坏后代节点，之后不能将该节点插入到其他元素中
 *          
 *                  
 */


/**
 * 数据存储：
 * 
 * sessionStorage：返回一个Storage对象  键值对以字符串形式存储
 *      方法：
 *          sessionStorage.setItem('key', 'value')
 *          sessionStorage.getItem('key')
 *          sessionStorage.removeItem('key')
 *          sessionStorage.clear()：清空所有数据
 *      注意🥣🥣：
 *          在页面会话期间（页面未关闭，重新加载，恢复页面，直接关闭浏览器但标签页没关闭）一直保存数据，关闭页面数据就会被清除
 *          打开多个相同url的页面、将http协议转为https，会创建各自不同的sessionStorage
 *          容量是5Mb
 * 
 * localStorage: 
 *      返回一个Storage对象 
 *      数据可以长期保留（域名和协议相同，同一个浏览器中任意标签页打开都能获取到该数据），
 *      键值对以字符串形式存储，
 *      方法和sessionStorage类似，
 *      不同页面协议会创建不同的localStorage
 *      容量是5Mb
 * 
 * cookie：
 *      容量4Kb
 *      请求涉及cookie时，就要在浏览器/服务器之间来回传送，数据始终在同源的http请求中携带（数据不能太大的原因）
 *      每一次请求，cookie都会随着请求发送到服务器
 *      生命期：浏览器会话期间，关闭窗口cookie消失
 * 
 *      设置值：
 *          document.cookie = new_cookies（只能对一个cookie进行设置/更新）
 *          每条cookie以分号空格分隔，即【; 】
 *          该属性每次只添加/更新一个cookie
 */


/**
 * 严格模式："use strict";（在作用域第一行声明，否则无效）
 *      注：
 *          只要第一行声明之前不产生实际运行结果的语句，就是有效的，比如跟在一个分号;后面也是有用的
 *      特性：
 *          全局变量必须显式声明
 *          只允许静态绑定，即在编译时就要确定属性/方法的归属
 *              禁止使用with语句
 *              自动创建属于eval的作用域
 *          禁止this指向全局对象
 *              构造函数直接调用（忘记加new），this不会指向全局，此时type error
 *          禁止在函数内部遍历调用栈
 *              禁止fn.caller, fn.arguments，此时TypeError
 *          禁止删除变量，只有configurable是true的对象属性才能删除
 *          显式报错：
 *              比如对只读变量赋值，对使用getter方法读取的属性赋值，对禁止扩展的对象添加属性，删除不可删除的属性（比如Objct.prototype）
 *          重名错误：
 *              对象不能有重名属性，函数不能有重名参数，
 *          禁止八进制表示法
 *          arguments对象限制：
 *              不允许对arguments赋值   
 *              arguments不再追踪函数参数变化
 *              禁止使用arguments.callee
 *          函数必须声明在顶层：不允许在非函数代码块声明函数
 *          保留字做变量名报错
 *          
 *          
 * 
 */

 // 严格模式下，未声明变量就赋值，发生reference error
function getAge() {
  'use strict'
  age = 21
  console.log(age)
}

getAge()


/**
 * 等于与全等于：
 * 
 * 等于：
 *    比较相同类型的值时和全等于一致
 *    比较🟧🟧不同类型的值🟧🟧会发生转换，然后再用严格相等比较
 *        不同的原始类型互相比较时，原始类型的值会转为数值类型再比较
 *        对象与原始类型的值比较，会先转为原始类型的值（使用valueof方法）
 *        undefined和null与其他类型比较时都是false，相互比较为true
 * 
 * 全等于（严格相等）：
 *    同一类型的原始值相同，则两者相等
 *    不同类型值不相等
 *    同一类型的对象，✅引用相等时才相等，否则不相等
 *    undefined与null与自身相等
 * 
 */

/**
 * 对象的构造函数：
 *    构造函数的方法只能由构造函数本身调用，实例只能调用构造函数原型中的方法
 *      
 */

function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const member = new Person("Lydia", "Hallie");
Person.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
}

console.log(member.getFullName());  // Uncaught SyntaxError: Identifier 'member' has already been declared


/**
 * 函数：Function
 * 
 *    注意：
 *        🥫函数是一个特殊的对象，所以它可以拥有属性，并且可增加/修改属性
 */


// 🥫
function bark() {
  console.log('Woof!')
}

bark.animal = 'dog'   // 正常运行

/**
 * 类：Class
 *      
 *    注意：
 *        类中的静态方法（static）只能由类本身调用，不能传递给实例
 */