# Lexical Grammar
- Source Character - any Unicode code point. [Unicode & UTF 8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

>互联网的普及，强烈要求出现一种统一的编码方式。UTF-8 就是在互联网上使用最广的一种 Unicode 的实现方式。其他实现方式还包括 UTF-16（字符用两个字节或四个字节表示）和 UTF-32（字符用四个字节表示），不过在互联网上基本不用。重复一遍，这里的关系是，UTF-8 是 Unicode 的实现方式之一。

- InputElement :: 
  - WhiteSpace
  - LineTerminator 
  - Comment 
  - CommonToken
    - IdentifierName
    - Punctuator 
    - [NumericLiteral](./Number/Number.md) 
    - StringLiteral 
    - Template

*[Playing with In-Memory Data Structure of JavaScript: Introduction to UTF, Typed Arrays and Blob](https://medium.com/jspoint/playing-with-in-memory-data-structure-of-javascript-introduction-to-utf-typed-arrays-and-blob-f856d3041a44)*


UTF-8 encoding function


