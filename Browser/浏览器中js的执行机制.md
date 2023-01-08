# JavaScript 代码的执行流程
一段 JavaScript 代码在执行之前需要被 JavaScript 引擎编译，编译完成之后，才会进入执行阶段
## 编译阶段
![](./images/js%E7%BC%96%E8%AF%91%E9%98%B6%E6%AE%B5.webp)
输入一段代码，经过编译后，会生成两部分内容：执行上下文（Execution context）和可执行代码。

[**执行上下文**](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth#javascript_execution_contexts)

> 是 JavaScript 执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的诸如 this、变量、对象以及函数等。在执行上下文中存在一个变量环境的对象（Viriable Environment），该对象中保存了变量提升的内容，

哪些情况下代码才算是“一段”代码，才会在执行之前就进行编译并创建执行上下文。一般说来，有这么三种情况：
- 当 JavaScript 执行全局代码的时候，会编译全局代码并创建全局执行上下文，而且在整个页面的生存周期内，全局执行上下文只有一份。
- 当调用一个函数的时候，函数体内的代码会被编译，并创建函数执行上下文，一般情况下，函数执行结束之后，创建的函数执行上下文会被销毁。
- 当使用 eval 函数的时候，eval 的代码也会被编译，并创建执行上下文。

**调用栈**
- 每调用一个函数，JavaScript 引擎会为其创建执行上下文，并把该执行上下文压入调用栈，然后 JavaScript 引擎开始执行函数代码。
- 如果在一个函数 A 中调用了另外一个函数 B，那么 JavaScript 引擎会为 B 函数创建执行上下文，并将 B 函数的执行上下文压入栈顶。
- 当前函数执行完毕后，JavaScript 引擎会将该函数的执行上下文弹出栈。
- 当分配的调用栈空间被占满时，会引发“堆栈溢出”问题。

**[如何解决栈溢出？](./call%20stack.js)**
比如递归调用的形式改造成其他形式，或者使用加入定时器的方法来把当前任务拆分为其他很多小任务。

**变量提升（Hoisting）**

> 指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分（function的声明主要有: function declaration会将方法体也提升, function expression同变量提升一样，只会提升声明）提升到代码开头的“行为”。变量被提升后，会给变量设置默认值，这个默认值就是我们熟悉的 undefined。变量提升只提升声明(left hand）不提升赋值(right hand)；
> 一段代码如果定义了两个相同名字的函数，那么最终生效的是最后一个函数.
> 如果变量和函数同名，那么在编译阶段，变量的声明会被忽略
> 而函数体内的代码只有在调用的时候才会被编译。

变量提升带来的问题：
- 变量容易在不被察觉的情况下被覆盖掉
- 本应销毁的变量没有被销毁
解决：ES6 引入了 let 和 const 关键字，从而使 JavaScript 也能像其他语言一样拥有了[块级作用域](#作用域scope)。


>**lexical scope VS dynamic scope**
>- [lexical scope](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)发生在编译阶段，会产生变量提升的效果；
>- JavaScript的Dynamic Scope发生在执行阶段，会产生this binding, prototype chaining search的过程；
>
>In Javascript, our lexical scope which is the (available data + variables where the function was defined ) determines our available variables. Not where the function is called(Dynamic scope).
>
>Everything in Javascript is lexically scoped, how you write it determines what we have available except for the this keyword. this is dynamically scoped. That is, it doesn't matter where it was written, what matters is how the function was called.
>
>How to fix: arrow function(arrow functions are lexically bound);bind;


## 执行阶段
JavaScript 引擎开始执行“可执行代码”，按照顺序一行一行地执行。JavaScript 引擎会从变量环境中去查找自定义的变量和函数。先是生成字节码，然后解释器可以直接执行字节码，输出结果。  
但是通常Javascript还有个编译器，会把那些频繁执行的字节码编译为二进制，这样那些经常被运行的函数就可以快速执行了，通常又把这种解释器和编译器混合使用的技术称为JIT

# [作用域(scope)](./https://developer.mozilla.org/en-US/docs/Glossary/Scope)
> 作用域是指在程序中定义变量的区域，该位置决定了变量的生命周期。通俗地理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。
- Global scope:The default scope for all code running in script mode.全局作用域中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。
- Function scope:The scope created with a function.函数作用域就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。
- Module scope: The scope for code running in module mode.
- Block scope: The scope created with a pair of curly braces (a block).
    - block内部的var变量能够穿透block提升到global scope.
    - 变量提升在有let或者const的block中会出现Temporal Dead Zone Error, 效果好似没有提升；

## JS如何实现block scope
1. 编译并创建执行上下文
    - 函数内部通过 var 声明的变量，在编译阶段全都被存放到变量环境(Variable Enviroment)里面了。
    - 函数内部通过 let 声明的变量，在编译阶段会被存放到词法环境（Lexical Environment）中。
    - 在函数内部的的块级作用域内部，通过 let 声明的变量并没有被存放到词法环境中。
2. 执行代码
在词法环境内部，维护了一个小型栈结构，栈底是函数最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压到栈顶；当作用域执行完成之后，该作用域的信息就会从栈顶弹出，这就是词法环境的结构。
    - 当进入函数的作用域块时，作用域块中通过 let 声明的变量，会被存放在词法环境的一个单独的区域中，这个区域中的变量并不影响作用域块外面的变量，即使是同名变量（仅仅指通过let const声明的变量）
    - 代码执行时，沿着词法环境的栈顶向下查询，如果在词法环境中的某个块中查找到了，就直接返回给 JavaScript 引擎，如果没有查找到，那么继续在变量环境中查找。

# Scope Chain 作用域链：通过作用域查找变量的链条
在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 outer。当一段代码使用了一个变量时，JavaScript 引擎首先会在“当前的执行上下文”中查找该变量，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续在 outer 所指向的执行上下文中查找，我们把这个查找的链条就称为作用域链；在 JavaScript 执行过程中，其**作用域链是由[词法作用域](#词法作用域)决定的**。
## [词法作用域(Lexical scoping)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#lexical_scoping)
词法作用域就是指作用域是由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符。也就是说，词法作用域是代码编译阶段就决定好的，和函数是怎么调用的没有关系。The word lexical refers to the fact that lexical scoping uses the location where a variable is declared within the source code to determine where that variable is available. Nested functions have access to variables declared in their outer scope.

## Closure
A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

闭包如何产生的？（但扩大概念的话，其实只要有函数被创建就有闭包产生）

在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。

闭包如何回收？
- 通常，如果引用闭包的函数是一个全局变量，那么闭包会一直存在直到页面关闭；但如果这个闭包以后不再使用的话，就会造成内存泄漏。
- 如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。

闭包使用原则

如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量。

思考：
```js
var bar = { 
    myName:"time.geekbang.com", 
    printName: function () { 
        console.log(myName) 
    } 
};
function foo() { 
    let myName = "极客时间" 
    return bar.printName
};
let myName = "极客邦";
let _printName = foo();
_printName();
bar.printName();
```

# This
> 作用域链和 this 是两套不同的系统，它们之间基本没太多联系!

this 是和执行上下文绑定的，也就是说每个执行上下文中都有一个 this
![](./images/execution%20context-this.webp)

执行上下文主要分为三种——全局执行上下文、函数执行上下文和 eval 执行上下文，所以对应的 this 也只有这三种:
- 全局执行上下文中的 this:全局执行上下文中的 this 是指向 window 对象的。这也是 this 和作用域链的唯一交点，作用域链的最底端包含了 window 对象，全局执行上下文中的 this 也是指向 window 对象;
- 函数中的 this :默认情况下调用一个函数，其执行上下文中的 this 也是指向 window 对象的.

    如何设置函数执行上下文中的 this 值：
    1. call/bind/apply
    2. 通过一个对象来调用其内部的一个方法，该方法的执行上下文中的 this 指向对象本身。
    3. [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new), 通过构造函数设置this。
    
        当执行 new CreateObj() 的时候，JavaScript 引擎做了如下四件事：
        - 首先创建了一个空对象 tempObj；
        - 接着调用 CreateObj.call 方法，并将 tempObj 作为 call 方法的参数，这样当 CreateObj 的执行上下文创建时，它的 this 就指向了 tempObj 对象；
        - 然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向了 tempObj 对象；
        - 最后返回 tempObj 对象。
    4. *箭头函数 箭头函数不会创建执行上下文，它里面的this会指向外层函数的this*
```js
function CreateObj(){
  this.name = "极客时间"
}
var myObj = new CreateObj()

//相当于：
// var tempObj = {} 
// CreateObj.call(tempObj) 
// return tempObj
```
- eval 中的 this

## this的设计缺陷及解决方案
1. 嵌套函数中的 this 不会从外层函数中继承
```js
var myObj = {
  name : "极客时间", 
  showThis: function(){
    console.log(this)
    function bar(){console.log(this)}
    bar()
  }
}
myObj.showThis()
```
Solutions:
- this 保存为一个 self 变量，再利用变量的作用域机制传递给嵌套函数。（本质是把 this 体系转换为作用域的体系）
```js
var myObj = {
  name : "极客时间", 
  showThis: function(){
    console.log(this)
    var self = this;//在 showThis 函数中声明一个变量 self 用来保存 this，然后在 bar 函数中使用 self
    function bar(){
      self.name = "极客邦"
    }
    bar()
  }
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)
```
- 因为ES6 中的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数。因此继续使用 this，但是要把嵌套函数改为箭头函数，因为箭头函数没有自己的执行上下文，所以它会继承调用函数中的 this。

2. 普通函数中的 this 默认指向全局对象 window
- 如果要让函数执行上下文中的 this 指向某个对象，最好的方式是通过 call 方法来显示调用。
- 如果不希望函数默认this指向全局window，可以通过设置 JavaScript 的“严格模式”,在严格模式下，默认执行一个函数，其函数的执行上下文中的 this 值是 undefined

## this总结
- 当函数作为对象的方法调用时，函数中的 this 就是该对象；
- 当函数被正常调用时，在严格模式下，this 值是 undefined，非严格模式下 this 指向的是全局对象 window；
- 嵌套函数中的 this 不会继承外层函数的 this 值。
- 因为箭头函数没有自己的执行上下文，所以箭头函数的 this 就是它外层函数的 this。
