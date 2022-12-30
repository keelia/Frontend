
# JavaScript 代码的执行流程
一段 JavaScript 代码在执行之前需要被 JavaScript 引擎编译，编译完成之后，才会进入执行阶段
## 编译阶段
![](./images/js%E7%BC%96%E8%AF%91%E9%98%B6%E6%AE%B5.webp)
输入一段代码，经过编译后，会生成两部分内容：执行上下文（Execution context）和可执行代码。

**执行上下文**

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
JavaScript 引擎开始执行“可执行代码”，按照顺序一行一行地执行。JavaScript 引擎会从变量环境中去查找自定义的变量和函数。先是生成字节码，然后解释器可以直接执行字节码，输出结果。  但是通常Javascript还有个编译器，会把那些频繁执行的字节码编译为二进制，这样那些经常被运行的函数就可以快速执行了，通常又把这种解释器和编译器混合使用的技术称为JIT

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

# Scope Chain 作用域链
在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 outer。当一段代码使用了一个变量时，JavaScript 引擎首先会在“当前的执行上下文”中查找该变量，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续在 outer 所指向的执行上下文中查找，我们把这个查找的链条就称为作用域链；在 JavaScript 执行过程中，其作用域链是由[词法作用域](#词法作用域)决定的。
## [词法作用域(Lexical scoping)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#lexical_scoping)
词法作用域就是指作用域是由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符。也就是说，词法作用域是代码编译阶段就决定好的，和函数是怎么调用的没有关系。The word lexical refers to the fact that lexical scoping uses the location where a variable is declared within the source code to determine where that variable is available. Nested functions have access to variables declared in their outer scope.