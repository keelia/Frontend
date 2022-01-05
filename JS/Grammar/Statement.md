# Statements(*ECMA 13-Statements and Declarations*)
- 简单语句
  - ExpressionStatement : `a = 1+2`
  - EmptyStatement : `;`
  - DebuggerStatement
  - ContinueStatement :`countinue label?`
  - BreakStatement :`break label?`
  - ThrowStatement
  - [+Return] ReturnStatement
- 组合语句
  - BlockStatement:
    - 会把多条语句用大括号括起来变成一条语句: `{ statement1; statement2 }`
    - 还有为const,let提供作用域的功能,a在大括号外面无法访问:`{coust a =1};{coust a = 2}`
    - block statement正常完成的completion record的type是normal,但是如果block里面有任何一条非normal的语句,会中断后面的语句，以及改变整个block语句的completion record type。这也是break，continue这个的语句得以改变语句的执行顺序所基于的基础逻辑。`{const a =1;throw 1;//let b = 1; b=foo();(won't be run)}`
  - VariableStatement :: var VariableDeclarationList;
    - 变量或者函数声明会有预处理(*13.3.2.1 Static Semantics: BoundNames*/*14.1.3 Static Semantics: BoundNames*),会先绑定名字或者叫变量或者函数”提升“。使得可以在函数声明定义之前调用函数，或者在var变量定义之前调用它，但是此时变量未赋值。
  - IfStatement 
  - BreakableStatement
    - IterationStatement
      - do Statement while ( Expression ) ;
      - while ( Expression ) Statement 
      - for ( [lookahead ∉ { let [ }] Expression?; Expression?;Expression?)Statement
      - for ( var VariableDeclarationList Expression?;Expression?)Statement
      - for ( LetOrConst *ForBinding* Expression? ;Expression?)Statement
        - for的()里面有一个“副”作用域，因此`for(let i=0;i<10;i++){let i = 2 ;console.log(i)}`这里面重新定义i并不会报错。
      - for ( [lookahead ∉ { let [ }] LeftHandSideExpression in Expression)Statement
      - for ( var *ForBinding* in Expression )Statement
      - for ( LetOrConst *ForBinding* in Expression )Statement
      - for ( [lookahead ≠ let] LeftHandSideExpression of [AssignmentExpression](./Expression.md#AssignmentExpression))Statement
      - for ( var *ForBinding* of AssignmentExpression )Statement
      - for ( LetOrConst *ForBinding* of AssignmentExpression )Statement
      - [+Await] for await ( [lookahead ≠ let] LeftHandSideExpression of AssignmentExpression)Statement
      - [+Await] for await ( var *ForBinding* of AssignmentExpression)Statement
      - [+Await] for await ( LetOrConst *ForBinding* of AssignmentExpression)Statement
    - SwitchStatement
  - WithStatement
  - LabelledStatement
  - TryStatement
    - try Block Catch 
      - catch(e)的()并没有产生新的作用域，因此`try{throw 1}catch(e){let e =2;console.log(e)}`会报错。
    - try Block Finally 
    - try Block Catch Finally
- 声明
  - FunctionDeclaration
    - 注意区分函数声明和函数表达式；函数声明必须有名字，函数表达式可以有名字，也可以没名字。只要没有出现在语句开头，就是表达式。类似的有class和generator。
  - GeneratorDeclaration
    - 有声明和表达式两种形式。
    - 一个函数可以分步返回多个值。功能和function一样。
  - AsyncFunctionDeclaration 
  - AsyncGeneratorDeclaration`function sleep(seconds){return new Promise(resolve=>setTimeout(resolve,seconds))}
        async function* foo(){
        var i =0;
        while(true){yield i++;await sleep(1000)}
        }
        void async function(){
        var g = foo();
        for await(let e of g){console.log(e)}
        }()`
  - ClassDeclaration
    - class声明必须有名字，class表达式可以没名字。
    - 不可以重复声明，定义必须在使用前面
  - LexicalDeclaration :: LetOrConst BindingList
     - 不可以重复声明，定义必须在使用前面

Runtime
- Completion Record(*ECMA 6.2.3 The Completion Record Specification Type*).Runtime会产生的一种类型。
  - [[Type]]
    - Value : One of normal, break, continue, return, or throw 
    - Meaning : The type of completion that occurred.
  - [[Value]] 
    - Value : any ECMAScript language value（JS的7种数据类型, String,Number,etc） or empty
    - Meaning : The value that was produced.
  - [[Target]]
    - Value : any ECMAScript string or empty
    - Meaning : The target label for directed control transfers.专门给label用的，只有涉及到label的语句才会用这个字段,即break,countinue.只有iteration statement和switch statement可以消费这种带标签的countinue和break。其他的语句也可以加标签，但是没有用。





- Lexical Environment