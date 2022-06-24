# Types
- Number
- String
- Boolean
- Null
- Undefined
- Symbol
- Object:
  - 唯一性
  - 有状态
  - 有行为：状态的改变即是行为。狗咬人，“咬”是谁的行为？所有对象的行为，必须是改变自身状态的行为。`class Dog{bite(human){}}`bite这这里并未改变狗的状态。应该是`class Human{hurt(damage){}}`

> 在设计对象的状态和行为时，我们应该总是遵循“行为改变状态”的原则，行为的代码应该是改变这个objecy自身的，而不要按照业 务描述去设计代码/命名。

# Object in JS(*6.1.7 The Object Type*)
在js运行时，原生对象的描述非常简单，我们只需要关心属性和原型（原型不是属性）两个部分。
## Object
- prototype
- property
  - key-value对
  - key可以是symbol或者string
  - property有两类，各有不同的atrributes：
    - data property数据型属性-一般用于描述状态，如果储存函数，也可用于描述行为。
      - [[Value]]: Any ECMAScript language type.The value retrieved by a get access of the property.
      - [[Writable]] :Boolean.If false, attempts by ECMAScript code to change the property's [[Value]] attribute using [[Set]] will not succeed.
      - [[Enumerable]] :Boolean. If true, the property will be enumerated by a for-in enumeration (see 13.7.5). Otherwise, the property is said to be non-enumerable.
      - [[Configurable]]:Boolean.If false, attempts to delete the property, change the property to be an accessor property, or change its attributes (other than [[Value]], or changing [[Writable]] to false) will fail.因此Configurable管Writable，Enumerable和自己。如果自己被设置成false，就永远改变不了了。
    - accessor property访问器属性-用于描述行为。保守的用，只用于基础库的设计，其他时候能不用尽量不用。
    - [[Get]]：get和set都是函数，不遵循get和set一定一致，也不一定每次get都返回相同值，想怎么写怎么写。
    - [[Set]]
    - [[Enumerable]] 
    - [[Configurable]]

> prototype chain保证了每个对象只需要描述自己和原型的区别即可。

## Object API
- 基本的对象能力，不带任何prototype based或者class based特点（最原始的面向对象能力）：{} object.,object[], Object.defineProperty
- 原型思想的系统去创建对象或者获取/修改对象的原型 Object.create/Object.setPrototypeOf/Object.getPrototypeOf
- 支持了面向类的范式：new, class, extends（当然js在运行时的时候是只有prototype机制的，这些只是在基于原型的基础上模拟面向类的方法 ）
- ❌ 不知所云用，new, function, prototype来实现运行时是原型，语法上像java，实际上不知道是什么的机制。

> 不要第二，三套同时混用，抛弃第四套。

## Function Object(*6.1.7.2 Object Internal Methods and Internal Slots-Table 6: Additional Essential Internal Methods of Function Objects*)
> 一种特殊的对象，带了property和prototype之外的东西：一个行为[[call]].因此Object带了call就是Function，带了constructor就是构造器。
> js原生的function关键字，箭头运算符，或者Function构造器创建的对象会有[call]]这个行为，也是构造器。用类似f()这样的语法调用函数时，会访问到[call]这个行为，如果对应的对象没有call这个行为就会报错。 
> 应当注意，函数被call和作为构造器可以产生完全两种不一样的结果:`Number(123) //123;new Number(123) //Number {123};Date()//'Wed Jan 05 2022...';new Date()//Wed Jan 05 2022 16:46:44 GMT+1300 (New Zealand Daylight Time)`.代码中需要new的时候都用class去写，而不用function。
Internal Method
- [[Call]]
  - Signature : (any, a List of any) → any
  - Description: Executes code associated with this object. Invoked via a function call expression. The arguments to the internal method are a this value and a list containing the arguments passed to the function by a call expression. Objects that implement this internal method are callable.
- [[Construct]]
  - Signature : (a List of any, Object) → Object
  - Description: Creates an object. Invoked via the new or super operators. The first argument to the internal method is a list containing the arguments of the operator. The second argument is the object to which the new operator was initially applied. Objects that implement this internal method are called constructors. A function object is not necessarily a constructor and such non-constructor function objects do not have a [[Construct]] internal method.

## Special Object(*9.4 Built-in Exotic Object Internal Methods and Slots*)
Array.length(*9.4.2 Array Exotic Objects*)：Specifically, whenever an own property is added whose name is an array index, the value of the "length" property is changed
Object.prototype[setPrototypeOf](*9.4.7 Immutable Prototype Exotic Objects*):不可以再给Object.prototype设置prototype`Object.setPrototypeOf(Object.prototype,{a:1})//Uncaught TypeError: Immutable prototype object '#<Object>' cannot have their prototype set at Function.setPrototypeOf (<anonymous>)`

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

## Get Object
```js
var o = {};
o = function(){};
o= new Object();
o = Object({});
o = Object.create({})
o = (function(){return this}).call({})
o = JSON.parse('{}');
o = Object.assign({});
o = new (class cls{});
```

