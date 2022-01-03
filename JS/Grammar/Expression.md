# Expressions (priority from high to low)

## LeftHandSideExpression :
- NewExpression 
- CallExpression

MemberExpression
- PrimaryExpression
- MemberExpression . IdentifierName : a.b, a[b]
- MemberExpression TemplateLiteral : foo\`string\`
- SuperProperty : super.b, super['b']
- MetaProperty :  new.target; used in function body;
- new MemberExpression Arguments : new Foo()

NewExpression: 
- MemberExpression 
- new NewExpression : new Foo

> new Foo() has higher priority than new Foo: new Foo() => new (Foo())

CallExpression: 
- SuperCall : super()
- CallExpression Arguments :  foo()
- CallExpression [ Expression ] : foo()['b']
- CallExpression . IdentifierName : foo().b
- CallExpression TemplateLiteral : foo()\`abc\`

> new foo()['b'] => (new foo())['b']

> new foo['b'] => new (foo['b'])

## Update Expressions
- LeftHandSideExpression 
- LeftHandSideExpression **[no LineTerminator here]** ++  : a++
- LeftHandSideExpression **[no LineTerminator here]** --  : a--
- ++ UnaryExpression
- -- UnaryExpression

```js
var a =1,b=1,c=1;
a
++
b
++
c
console.log(a,b,c)
```
## UnaryExpression
- UpdateExpression 
- delete UnaryExpression : delete a.bbb
- void UnaryExpression : void foo()
- typeof UnaryExpression : type of a
- + UnaryExpression : +a
- - UnaryExpression : -a
- ~ UnaryExpression : ~ a
- ! UnaryExpression :!a
- [+Await] AwaitExpression : await a

## ExponentiationExpression
- UnaryExpression
- UpdateExpression ** ExponentiationExpression

> 唯一一个右结合的运算符：`2**3**2` =>`2**(3**2)`

## MultiplicativeExpression
- ExponentiationExpression 
- MultiplicativeExpression MultiplicativeOperator(*/%) ExponentiationExpression

## AdditiveExpression
- MultiplicativeExpression
- AdditiveExpression + MultiplicativeExpression 
- AdditiveExpression - MultiplicativeExpression

## ShiftExpression
- AdditiveExpression
- ShiftExpression << AdditiveExpression 
- ShiftExpression >> AdditiveExpression 
- ShiftExpression >>> AdditiveExpression

## RelationalExpression
- ShiftExpression
- RelationalExpression < ShiftExpression
- RelationalExpression > ShiftExpression 
- RelationalExpression <= ShiftExpression 
- RelationalExpression >= ShiftExpression 
- RelationalExpression instanceof ShiftExpression [+In] 
- RelationalExpression[+In, ?Yield, ?Await] in ShiftExpression : `1 in [1,2,3]`

## EqualityExpression
- RelationalExpression
- EqualityExpression == RelationalExpression 
- EqualityExpression != RelationalExpression 
- EqualityExpression === RelationalExpression 
- EqualityExpression !== RelationalExpression

## Binary Bitwise Operators
- BitwiseANDExpression
    * EqualityExpression
    * BitwiseANDExpression & EqualityExpression
- BitwiseXORExpression
    * BitwiseANDExpression
    * BitwiseXORExpression ^ BitwiseANDExpression
- BitwiseORExpression
    * BitwiseXORExpression
    * BitwiseORExpression | BitwiseXORExpression

## Binary Logical Operators
- LogicalANDExpression
    * BitwiseORExpression
    * LogicalANDExpression && BitwiseORExpression
- LogicalORExpression
    * LogicalANDExpression
    * LogicalORExpression || LogicalANDExpression

> 逻辑运算符是短路逻辑；

## ConditionalExpression : 
- LogicalORExpression
- LogicalORExpression ? AssignmentExpression[+In, ?Yield, ?Await] : AssignmentExpression

> 三目运算符也是短路逻辑, `true:'will be called':'will not be called'`

## AssignmentExpression 
- ConditionalExpression 
- [+Yield] YieldExpression
- ArrowFunction 
- AsyncArrowFunction
- LeftHandSideExpression = AssignmentExpression 
- LeftHandSideExpression AssignmentOperator(one of*=/=%=+=-=<<=>>=>>>=&=^=|=**=) AssignmentExpression 


## Expression : 
- AssignmentExpression
- Expression **,** AssignmentExpression: `var a = 1,b=1`

# Type Conversion
![image](./Type%20Conversion.png)
## Boxing & Unboxing
### Boxing
涉及到四种基本的类：
- Number
- String
- Boolean
- Symbol
  > Symbol不可以new

> 注意区分类和类型：
> ```js
> new Number(123)//实例化一个Number类
> Number('123')//会强制类型转换变成Number类型,Boolean/String一样，这三种类型行为统一
> !new String('') //false
> !''//true
> //除了new String()之外还有一种强制装箱的办法：Object带不带new都一样，会返回对应类的实例
> Object('1')//String {'1'}
> Object(1)//Number {1}
> Object(true)//Boolean {true}
> Object(Symbol('1')) //Symbol {Symbol(1)}
> Object(Symbol('1')).constructor //ƒ Symbol() { [native code] }
> Object(Symbol('1')).__proto__ === Symbol.prototype //true
> Object(Symbol('1')) instanceof Symbol //true
> //还可以利用函数的this去装箱
> (function(){return this}).apply(Symbol('1')) //Symbol {Symbol(1)}
> (function(){return this}).apply(String('1'))//String {'1'}
> ```



>不是所有的基本类型都可以装箱的，只有以上四种可以。
> ```js
> Object(null)//{}
> Object(undefined)//{}
> ```

### Unboxing
Symbol.toPrimitive（ecma 7.1.1）
valueOf
toString

```js
1 + {}//'1[object Object]'
1+{valueOf(){return '1'}}//'11'
1+{valueOf(){return 1}}//2
1+{valueOf(){return 1},toString(){return '2'}}//2
1+{valueOf(){return '1'},toString(){return '2'}}//'11'
'1'+{valueOf(){return '23'},toString(){return '2'}}//'123'
1+{toString(){return '2'}}//'12'
1+{[Symbol.toPrimitive](){return 3},valueOf(){return '1'},toString(){return '2'}}//4
1+{[Symbol.toPrimitive](){return '3'},valueOf(){return '1'},toString(){return '2'}}//'13'
1+{[Symbol.toPrimitive](){},valueOf(){return '1'},toString(){return '2'}}//NaN
1+{[Symbol.toPrimitive](){return {}},valueOf(){return '1'},toString(){return '2'}}//Uncaught TypeError: Cannot convert object to primitive value
'1'+{valueOf(){return {}},toString(){return '2'}}//'12'
```

> 如果有Symbol.toPrimitive，就只调用它，没有的话会使用默认的Symbol.toPrimitive，这个默认的Symbol.toPrimitive会先调valueOf再调用toString，和加‘1’或者1都没关系。
> 默认的Symbol.toPrimitive有一个hint的情况，hint会决定先调用valueOf还是toString，没有hint的话就按照默认的顺序先number再string。比如
> > ecma 7.1.14 ToPropertyKey会先转成string
> > 1. Let key be ? ToPrimitive(argument, hint String). 
> > 2. If Type(key) is Symbol, then
> >    - a. Return key.
> > 3. Return ! ToString(key).