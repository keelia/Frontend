# CSS核心结构
在[CSS 2.1](https://www.w3.org/TR/CSS21/grammar.html#q25.0) 可以找到基本的css标准

- [At rules](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule)
  - @charset
  - @import
  - [@media](https://www.w3.org/TR/css-conditional/#at-media):可以nested，也可以和supports nested；可做重点了解。
  - [@supports](https://www.w3.org/TR/css-conditional/#at-supports)
  - @page
  - @namespace 
  - @font-face
  - @counter-style
  - @keyframes 
- 普通rules
  - [Selector](https://www.w3.org/TR/selectors-3/#grammar)
    - selectors_group
    - simple_selector
      - type div svg|a （带namespace的）
      - \#
      - .
      - [] \[attr=value\]
      - :伪类选择器
      - ::伪元素选择器
    - combinator
  - Declaration
    - key
      - property
      - [variable](https://www.w3.org/TR/css-variables/#defining-variables)
    - [value](https://www.w3.org/TR/css-values-4/)

# 选择器
## 选择器语法
- 简单选择器
- 复合选择器 compound： 简单选择器*(中间没有空格) ｜ * 或者 div必须写在最前面
- 复杂选择器：复合选择器 space / > / ~  / + / ||(不需要学) 复合选择器
- 选择器列表 带逗号分隔的多个选择器结合起来的列表
## 选择器优先级
## 伪类
- 超链接相关
  - :any-link 没有访问过的超链接 a不加href就不是超链接 同样的还有area
  - :link:visited 访问过的超链接
  - :hover 只能被鼠标出发
  - :active 有交互的元素有用 link/button 鼠标键盘都可以出发
  - :focus focus了之后不一定被active 鼠标键盘都可以出发
  - :target
- 树结构相关:都是针对自己而言的
  - :empty
  - *:nth-child()*
  - *:nth-last-child()*
  - :first-child *:last-child :only-child*
*需要回溯的伪类不推荐使用*
- 逻辑类
  - :not() 应只放简单选择器/复合选择器
  - *:where :has*

## 伪元素
- ::before
- ::after
- :first-line 跟实际显示的第一行有关，而不是回车
  - font系列
  - color系列
  - background系列
  - word-spacing
  - letter-spacing
  - text-decoration
  - text-transform
  - line-height
- :first-letter
  - font系列
  - color系列
  - background系列
  - word-spacing
  - letter-spacing
  - text-decoration
  - text-transform
  - line-height
  - float
  - vertical-align
  - 盒模型系列
    - margin
    - padding
    - border
> 为什么first-line不可以 float？
> > Float脱离流出去，就和first-line定义冲突了，脱离文档流和选中first-line,无限循环

> 为什么first-line可以设置font/letter-spacing/word-spacing等影响字宽的属性？
> > 因为first-line不是先算好一行再渲染到page上，而是一个一个的应用在文字上，直到这一行满了，其他的文字进入第二行，撤销first-line设置的属性。