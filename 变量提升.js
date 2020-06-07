
// 函数声明覆盖了变量声明,不管是变量先声明还是函数先声明
// 但是在{}块中，则会由重复声明的错误提示

var foo;

function foo() {
  
}

  console.log(typeof foo);  // function

function foo_copy() {
  
}
var foo_copy;



console.log(typeof foo_copy);  // function

/* {
  var bar;

  function bar() {

  }

  console.log(typeof bar);  // SyntaxError: Identifier 'bar' has already been declared
} */

/* {
  function bar1() {

  }

  var bar1;

  console.log(typeof bar1);  // SyntaxError: Identifier 'bar1' has already been declared
} */

function zoo() {
  var apple;

  function apple() {

  }

  console.log(typeof apple); // function
}

zoo() 


function zoo1() {
  

  function apple() {

  }

  var apple;

  console.log(typeof apple); // function
}

zoo1() 