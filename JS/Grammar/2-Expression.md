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