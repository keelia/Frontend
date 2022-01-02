> [Why 0.1+0.2!=0.3?!](https://www.barretlee.com/blog/2016/09/28/ieee754-operation-in-js/)
> JavaScript Number type is [a double-precision 64-bit binary format IEEE 754]()https://en.wikipedia.org/wiki/Double-precision_floating-point_format value.

# NumberLiteral :: 
- [DecimalLiteral](#DecimalLiteral)
- [BinaryIntegerLiteral](#BinaryIntegerLiteral) 
- [OctalIntegerLiteral](#OctalIntegerLiteral) 
- [HexIntegerLiteral](#HexIntegerLiteral)


## DecimalLiteral ::
- **0** [ExponentPart](#ExponentPart)?   0
- **0** **.** [ExponentPart](#ExponentPart)? 0.
- **0**  **.** [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 0.1
- **0**  **.** DecimalDigits [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 0.11
- **.** [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? .1
- **.** DecimalDigits [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? .11
- [NonZeroDigit](#NonZeroDigit) **.** [ExponentPart](#ExponentPart)? 1.
- [NonZeroDigit](#NonZeroDigit) **.** [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 1.0
- [NonZeroDigit](#NonZeroDigit) **.** DecimalDigits [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 1.00
- [NonZeroDigit](#NonZeroDigit) [DecimalDigit](#DecimalDigit) **.** [ExponentPart](#ExponentPart)? 10.
- [NonZeroDigit](#NonZeroDigit) [DecimalDigit](#DecimalDigit) **.** [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 10.0
- [NonZeroDigit](#NonZeroDigit) [DecimalDigit](#DecimalDigit) **.** DecimalDigits [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 10.001
- [NonZeroDigit](#NonZeroDigit) [ExponentPart](#ExponentPart)? 1
- [NonZeroDigit](#NonZeroDigit) [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 10
- [NonZeroDigit](#NonZeroDigit) DecimalDigits [DecimalDigit](#DecimalDigit)  [ExponentPart](#ExponentPart)? 100
- [NonZeroDigit](#NonZeroDigit) DecimalDigits [DecimalDigit](#DecimalDigit) **.** [ExponentPart](#ExponentPart)? 1000.
- [NonZeroDigit](#NonZeroDigit) DecimalDigits [DecimalDigit](#DecimalDigit) **.** [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 10000.0
- [NonZeroDigit](#NonZeroDigit) DecimalDigits [DecimalDigit](#DecimalDigit) **.** DecimalDigits [DecimalDigit](#DecimalDigit) [ExponentPart](#ExponentPart)? 1000.0000

### ExponentPart::
- [ExponentIndicator](#ExponentIndicator) [DecimalDigit](#DecimalDigit)
- [ExponentIndicator](#ExponentIndicator)  DecimalDigits [DecimalDigit](#DecimalDigit)
- [ExponentIndicator](#ExponentIndicator)  **+** [DecimalDigit](#DecimalDigit)
- [ExponentIndicator](#ExponentIndicator)  **+** DecimalDigits [DecimalDigit](#DecimalDigit)      
- [ExponentIndicator](#ExponentIndicator)  **-** [DecimalDigit](#DecimalDigit)
- [ExponentIndicator](#ExponentIndicator)  **-** DecimalDigits [DecimalDigit](#DecimalDigit)

#### DecimalDigit
- 0
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9
#### NonZeroDigit
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9
#### ExponentIndicator
- e
- E



## BinaryIntegerLiteral :: 
- **0b** [BinaryDigit](#BinaryDigit)
- **0B** [BinaryDigit](#BinaryDigit)
- **0b** [BinaryDigit](#BinaryDigit)s 0
- **0b** [BinaryDigit](#BinaryDigit)s 1
- **0B** [BinaryDigit](#BinaryDigit)s 0
- **0B** [BinaryDigit](#BinaryDigit)s 1

### BinaryDigit
- 0
- 1

## OctalIntegerLiteral :: 
- **0o** [OctalDigit](#OctalDigit)
- **0o** OctalDigits [OctalDigit](#OctalDigit)
- **0O** [OctalDigit](#OctalDigit)
- **0O** OctalDigits [OctalDigit](#OctalDigit)
  
### OctalDigit
- 0
- 1
- 2
- 3
- 4
- 5
- 6
- 7

## HexIntegerLiteral ::
- **0x** [HexDigit](#HexDigit)
- **0x** HexDigits [HexDigit](#HexDigit)
- **0X** [HexDigit](#HexDigit)
- **0X** HexDigits [HexDigit](#HexDigit)
  
### HexDigit
- 0
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9
- a
- b
- c
- d
- e
- f
- A
- B
- C
- D
- E
- F

# Regular Expression for matching Number
```js
var decimalLiteralTest = [
    '0','0.','0.1','0.11','.1','.11',
    '1.','1.0','1.00','10.','10.0','10.001',
    '1','10','100','1000.','10000.0','1010101.1','10000.00001',
    '0e1','0.0E-0','0.e22','0.1E33','0.11E+1','.1E-1','.11e00',
    '1.e1','1.0e3','1.00e4','10.e5','10.0e+1','10.001e-1',
    '1e44','10e22','100E1000','1000.e999','10000.0e-222','1010101.1e+256','10000.00001e+1'
    ];
var decimalLiteralFaliureTest = [
        '..1','.E1','01','001'
    ]

var decimalLiteralRegex = /(^((0?)|([1-9][0-9]*))([eE][+-]?[0-9]+)?$)|(^((0)|([1-9][0-9]*))\.([0-9]*)([eE][+-]?[0-9]+)?$)|(^\.([0-9]+)([eE][+-]?[0-9]+)?$)/;
decimalLiteralTest.forEach(str=>console.log(decimalLiteralRegex.test(str),str))
decimalLiteralFaliureTest.forEach(str=>console.log(decimalLiteralRegex.test(str),str))

var binaryLiteralTest = [
    '0b0','0b1','0B0','0B1',
    '0b1110','0b0001',
    '0B111111110','0B0111111001',
 ];

var binaryLiteralRegex = /^0[bB][01]+$/;
binaryLiteralTest.forEach(str=>console.log(binaryLiteralRegex.test(str),str)) 

var octalLiteralTest = [
    '0o0','0O1','0O0','0O1',
    '0o1234','0o567',
    '0o1234576','0O0177111001',
];

var octalLiteralFaluireTest = [
    '0O018989111001','000','001'
];

var octalLiteralRegex = /^0[oO][0-7]+$/;
octalLiteralTest.forEach(str=>console.log(octalLiteralRegex.test(str),str)) 

var hexLiteralTest = [
   '0x0','0Xc','0XA','0XB',
   '0x123abc4','0x567DEF',
   '0x12345efd76','0X0189ABC89111001',
];

var hexLiteralRegex = /^0[xX][0-9a-fA-F]+$/;
hexLiteralTest.forEach(str=>console.log(hexLiteralRegex.test(str),str)) 

var numberLiteralRegex = /((^((0?)|([1-9][0-9]*))([eE][+-]?[0-9]+)?$)|(^((0)|([1-9][0-9]*))\.([0-9]*)([eE][+-]?[0-9]+)?$)|(^\.([0-9]+)([eE][+-]?[0-9]+)?$))|(^0[bB][01]+$)|(^0[oO][0-7]+$)|(^0[xX][0-9a-fA-F]+$)/;
[...decimalLiteralTest,...binaryLiteralTest,...octalLiteralTest,...hexLiteralTest].forEach(str=>console.log(numberLiteralRegex.test(str),str)) 
```
