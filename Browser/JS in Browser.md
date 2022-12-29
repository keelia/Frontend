
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

> 指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的“行为”。变量被提升后，会给变量设置默认值，这个默认值就是我们熟悉的 undefined。
> 一段代码如果定义了两个相同名字的函数，那么最终生效的是最后一个函数.
> 如果变量和函数同名，那么在编译阶段，变量的声明会被忽略
> 而函数体内的代码只有在调用的时候才会被编译。

- 变量提升只提升声明(left hand）不提升赋值(right hand)
- function的声明主要有: function declaration, function expression
    - function declaration会将方法体也提升
    - function expression同变量提升一样，只会提升声明；
- 变量提升在有let或者const的block中会出现Temporal Dead Zone Error, 效果好似没有提升；
- 另外要注意block内部的var变量能够穿透block提升到global scope.

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