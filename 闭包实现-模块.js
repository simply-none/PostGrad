var my_modules = (function Manager() {
  var modules = {};

  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply(impl, deps);
  }

  function get(name) {
    return modules[name];
  }

  return {
    define: define,
    get: get,
  }
})();

my_modules.define('bar', [], function () {
  function hello(who) {
    return 'let me introduce: ' + who;
  }

  return {
    hello: hello,
  }
})

my_modules.define('foo', ['bar'], function (bar) {
  var hungry = 'hippo';

  function awesome() {
    console.log(bar.hello(hungry).toUpperCase());
  }

  return {
    awesome: awesome,
  }
})

var bar = my_modules.get('bar');
var foo = my_modules.get('foo');

console.log(bar.hello('hippo'));
foo.awesome();

function error_a() {
  var b = "b";
  console.log(this);

  /**
   * 在node中，此处会报错，浏览器中不会
   * TypeError: this.error_b is not a function
   */
  // this.error_b()
}

function error_b() {
  console.log(this);
}

var a = 2;

error_a()

function this_a() {

  console.log(this, "this_a");

  this_b();
}

function this_b() {

  console.log(this, "this_b");

  this_c();
}

function this_c() {

  console.log(this, "this_c");

  
}

this_a()

