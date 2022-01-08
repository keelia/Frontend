# js结构化的基础设施
js的执行粒度
- JS Context(js引擎能包含的最大粒度，对应一个global object) =>[Realm](#Realm(*8.2 Realms*))
- [宏任务-多个宏任务共享一个全局对象，和若干内置对象](#宏任务/微任务)
- [微任务（Promise](#宏任务/微任务)
- 函数调用（*8.3 Execution Contexts*）
- [语句/声明](./3-Statement.md)
- [表达式](./2-Expression.md)
- 直接量/变量/this


## 宏任务/微任务
> 事件循环不是js语言，也不是js引擎的概念，是node/browser去实现的一种机制；宏任务队列和事件循环都是在js context（js引擎）之外的概念（比如object-c或者浏览器的c++去管理宏任务/事件循环的）。

- 宏任务 ： `<script>`（传一段代码给js引擎）,UI交互(传一个function给js引擎), setTimeout,setInterval（它们是js宿主browser或者node提供的api，不是js语言提供的）都是宏任务；
- 微任务： Promise会产生微任务，如果promise当前的宏任务中有resolve，会为resolve的then里面的代码创建一个新的微任务（resolve了之后），放进当前的宏任务中；类似的还有await，语法上的then，在await等到了之后的代码，也会为之建立一个微任务并插入当前宏任务的微任务队列；

> 一个宏任务中只存在一个微任务（job）队列，微任务的入队时间决定它们被执行的顺序；宏任务中的同步代码都属于一个微任务并最先执行，
> 当前宏任务执行完了之后才会执行下一个宏任务
> *（ecma的job queue就是微任务队列，EnqueueJob就是入队微任务，8.6 RunJobs ( )就是最初的入口，了解即可）*

```JS
async function async1(){
    console.log('async 1 start')
    await async2()
    console.log('async 1 end')
}
async function async2(){
    console.log('async 2')
}
async1();
new Promise(function(resolve){
    console.log('Promise 1')
    resolve()
}).then(function(){ console.log('Promise 2')})
```

## Realm(*8.2 Realms*)
每个realm都有一套完整的js内置对象(包含global对象-*18 The Global Object*，和其他一些global访问不到的对象)。
[如何获得gloal对象的全部properties？](./GlobalObjectsGraph.html)

## Execution Context(*8.3 Execution Contexts*)
Execution Context Stack:
- Running Execution Context(top item of the stack)
- Execution Context includes:
  - code evaluation state： Any state needed to perform, suspend, and resume evaluation of the code associated with this execution context.代码执行的位置，主要是async函数和genertaor函数使用，正常的函数就执行到底然后pop出去了。
  - Function：If this execution context is evaluating the code of a function object, then the value of this component is that function object. If the context is evaluating the code of a Script or Module, the value is null.
  - Realm： The Realm Record from which associated code accesses ECMAScript resources.需要用到realm的场所包括
     - 正常的new Object/Array等不需要用到realm，这些变量直接去global object取就可以，但是var x = {};这里的{}需要知道自己所在的realm，去挂上prototype,因此一个iframe里面创建的var x = {}它的prototype不等于外面html的Object.prototype.类似的还有匿名的function`var f = function(){}`，匿名的class`var c = class{}`，数组`var a = []`
     - 做隐式类型转换的时候，会创建相应的对象，这些对象也是有原型的，如果没有realm，就不知道它们的原型是什么，`1. toString()`这里面需要转成哪个Number，也是当前realm里面的Number
  - ScriptOrModule ： The Module Record or Script Record from which associated code originates. If there is no originating script or module, as is the case for the original execution context created in InitializeHostDefinedRealm, the value is null.
  - VariableEnvironment:Identifies the Lexical Environment whose EnvironmentRecord holds bindings created by VariableStatements within this execution context.历史遗留包袱，仅仅用来处理var声明。
    ```js
    //case 1
    {//在block开始时开始创建lexical env，eval里面的x需要有一个地方去存，于是就有了VariableEnvironment
        let y = 2;
        eval('var x = 1')
    };
    //case 2:有with的时候，里面的var x声明到了哪里去，需要有一个地方存VariableEnvironment，由于var是函数级别的作用域，于是x被存在了with的外面
    with({a:1}){
        eval('var x=1;')
    }
    console.log(x)
    ```
  - LexicalEnvironment:Identifies the Lexical Environment used to resolve identifier references made by code within this execution context.取变量值的时候所用到的环境；
    - includes：
      - this:this什么时候塞进一个lexical env的逻辑很复杂，比如箭头函数的this是和lexical env其他的变量一起塞进去的，而正常函数的this是调用的时候才塞进lexical env里面的。
      - new.target
      - super
      - 变量
    - 另一种维度看它是Environment Record的链表的结构：
      - An Environment Record records the identifier bindings that are created within the scope of its associated Lexical Environment. It is referred to as the Lexical Environment's EnvironmentRecord.Environment Record includes below。从以下可以看到产生Environment Record的情况有global,with,funciton和moduel
        - Declarative Environment Records：Each declarative Environment Record is associated with an ECMAScript program scope containing variable, constant, let, class, module, import, and/or function declarations. 
          - Module Environment Records
          - Function Environment Records：A function Environment Record is a declarative Environment Record that is used to represent the top-level scope of a function and, if the function is not an ArrowFunction, provides a this binding. If a function is not an ArrowFunction function and references super, its function Environment Record also contains the state that is used to perform super method invocations from within the function.
        - Object Environment Records：一般是由with产生的。
          - Object Environment Records created for with statements (13.11) can provide their binding object as an implicit this value for use in function calls. 
        - Global Environment Records：任何一个js引擎的实例/js context级别的global只有一个
          - A global Environment Record is used to represent the outer most scope that is shared by all of the ECMAScript Script elements that are processed in a common realm
          - A global Environment Record is logically a single record but it is specified as a composite encapsulating an object Environment Record and a declarative Environment Record.
      - The outer environment reference is used to model the logical nesting of Lexical Environment values. The outer reference of a (inner) Lexical Environment is a reference to the Lexical Environment that logically surrounds the inner Lexical Environment. An outer Lexical Environment may, of course, have its own outer Lexical Environment. A Lexical Environment may serve as the outer environment for multiple inner Lexical Environments. 
    - 以上这些this/new.target/super/变量是如何产生的呢？机制就是closure的原理，以及以上的链表逻辑：在inner的enviroment records存上outter的references. 比如
        ```js
        {
        var y =2;
        function foo2(){
            var z = 2
            return function(){
                console.log(y,z)
            }
            //return ()=>{ 此时会有this存在在foo3的Environment Records里面
            //    console.log(y,z)
            //}
        }
        var foo3 = foo2()
        export foo3
        }
        ```
        > Function : foo3
        > - Environment Records :
        >   - z:2
        >   - this?:global (如果foo3是箭头函数)
        >   - outer-lexical env: 
        >       - Function : foo2
        >           - *Environment Records:*
        >               - *y:3*
        >               - this?:global (如果foo2是箭头函数)
        > - Code:console.log(y,z)
  - Generator? ：The GeneratorObject that this execution context is evaluating.只有由generator产生的execution context才有这个字段，为了yield服务的。需要知道每次调用generator.next的时候yield得位置。
- Execution Context has 2 types
  -  ECMAScript Code Execution Contexts include： code evaluation state/Function/Realm/ScriptOrModule/LexicalEnvironment/VariableEnvironment
  -  Generator Execution Contexts include： code evaluation state/Function/Realm/ScriptOrModule/LexicalEnvironment/VariableEnvironment/**Generator**

Execution Context 不要和[scope chain](https://blog.bitsrc.io/understanding-scope-and-scope-chain-in-javascript-f6637978cf53)弄混了，这两者没有任何的关系
> What is Scope?
> > Scope in JavaScript refers to the accessibility or visibility of variables. That is, which parts of a program have access to the variable or where the variable is visible.
> 
> There are three types of scope in JavaScript 
> > 1. Global Scope, 
> > 2. Function Scope: var是函数级别的作用域，没有被定义在函数里面时，就会放在global scope
> > 3. Block Scope: let/const是block级别的作用域。*ES6 introduced let and const variables, unlike var variables, they can be scoped to the nearest pair of curly braces. That means, they can’t be accessed from outside that pair of curly braces*
> 
> JavaScript supports Lexical Scope
> > Lexical Scope (also known as Static Scope) literally means that scope is determined at the lexing time (generally referred to as compiling) rather than at runtime. For example:
> ```js
> let number = 42;
> function printNumber() {
>   console.log(number);
> }
> function log() {
>   let number = 54;
>   printNumber();
> }
> // Prints 42
> log();
> ```
> Scope Chain:
> > When a variable is used in JavaScript, the JavaScript engine will try to find the variable’s value in the current scope. If it could not find the variable, it will look into the outer scope and will continue to do so until it finds the variable or reaches global scope.
> > If it’s still could not find the variable, it will either implicitly declare the variable in the global scope (if not in strict mode) or return an error.
