# Browser
## 浏览器工作原理
> what does browser do after typing an URL?
>>URL=(HTTP)=>HTML=(parse)=>DOM Tree=(CSS Computing)=>DOM With CSS=(Layout)=>DOM With Position=(Render)=>Bitmap(得到内存中的一张图片，展示出来)

## ISO-OSI七层网络模型
- 应用-HTTP-require('http') in node
- 表示-HTTP
- 会话-HTTP
- 传输-TCP-require('net') in node
- 网络-Internet
- 数据链路-4G/5G/WIFI
- 物理-4G/5G/WIFI

浏览器就是在TCP的上面。Toy-Browser就是用node require('net')自己去写http层
### TCP/IP的基础知识
TCP
- 流式传输
  - 已经假设ip层已经建立好链接了
  - 是可靠流，收不到会重发
- 端口
  - 标识应用，发给谁
- require('net')

IP
- 包
- IP地址
- libnet/lipcap.IP层的东西node是访问不到的，只能用C++去访问。 

### HTTP
- 在TCP的基础上建立了一个request/response模型，一问一答，先问后答。和TCP不一样，TCP服务端和客户端都可以互相发消息，只保证顺序和到达，不能保证客户端问了以后服务端一定会回答；
- HTTP 服务端不主动发消息，只有request了之后才会发response；

# Toy Browser
1. **URL=(HTTP)=>HTML**: Implement HTTP request/response methodology by using [net.socket](./https://nodejs.org/dist/latest-v16.x/docs/api/net.html#class-netsocket) in node, instead of using node's building 'http' lib;
     *  Create HTTP Request based on [HTTP 1.1 Protocol](https://datatracker.ietf.org/doc/html/rfc2616), *参考[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)*
         *  [Request line](https://datatracker.ietf.org/doc/html/rfc2616#section-5) : 
             *  Method(**GET/OPTIONS/POST/**HEAD/PUT/DELETE/TRACE/CONNECT)
             *  Path(Request-URI)
             *  HTTP 1.1(The Resource Identified by a Request)
         *  Request Headers
         *  Empty line
         *  Request body/Message body(https://datatracker.ietf.org/doc/html/rfc2616#section-4.3)
     * HTTP Response, since using net.socket to create TCP connection, TCP是流式数据，拿到的server端的数据流，不知道data from sever什么时候结束，因此需要ResponseParser
         * Status-Line
         * Response Header Fields
         * Empty line
         * Response body
            1. node一般是使用[chunked transfer- encoding](https://datatracker.ietf.org/doc/html/rfc2616#section-3.6.1),就是一行数字表示下一行开始有多少个字符，然后直到有一行的数字是0
            2. 因为tcp的数据是流式，因此没有办法用正则（无法保证一个chunked片段(*TrunkedBodyParser*)过来的时候刚好断在正确的位置，如`Content-Type: text/plain；Date: Sat, 08 （断在此处）Jan 2022 20:03:42 GMT`），而只能用[状态机](#状态机)。
2. **HTML=(parse)=>DOM Tree**: parse HTML string to DOM tree by following [HTML Tokenization](https://html.spec.whatwg.org/#data-state) and using FSM. 用FSM来分析html，html标准中已经规定了html的各个状态，toy-browser只挑选部分，完成最简版本。
   1. 实现的状态有：
    * 开始标签
    * 结束标签
    * 自封闭标签
   2. 在状态函数里面处理状态迁移；创建currentToken全局变量记录当前的tokenType和tokenContent，在状态函数中写入currentToken，在tag end状态去提交token（e.g. Emit the current input character as a character token.）注意，提交的token还并不是html element，因为每次startTag/endTag都是分开作为独立的token提交，需要后续进一步的处理。
   3. 处理属性
      1. 属性值分为单引号，双引号，无引号，需要较多的状态函数去处理；
      2. 处理属性的方式跟tag类似，创建全局变量记录当前的属性kv，然后在tag结束的时候把当前属性加在当前tag token上，再提交tag token。
   4. emit的tag token 通过使用栈去构建DOM Tree`element = {type:'element',children:[],attributes:[]}`
      1. 遇到tag start/开始标签的时候入栈
      2. 遇到tag end/结束标签的时候出栈
      3. 遇到selfClose时候认为入栈之后马上出栈
      4. 形成的element的父元素是它入栈的栈顶（`stack[stack.length-1]`）
      5. 预先创建一个document作为栈顶的element(`[{type:'document',children:[]}]`)，用来在children里面储存全部的自元素信息。因此最后解析完之后，这个栈也应该只剩下这一个元素。
   5. 处理文本节点`if token.type == 'text'`
      1. 多个文本标签的token过来需要合并,因此创建一个全局currentTextNode=null
      2. 文本节点是不会入栈的，收到第一个token之后，直接放进children里面。
3. DOM Tree=(CSS Computing)=>DOM With CSS
     1. Collect CSS rules(only considering rules inside style tag, not link tag)
         * 用一个css parser库去parse style tag里面的css文本 : npm install [css](https://www.npmjs.com/package/css) to Accepts a CSS string and returns an AST object.
         *  **在style tag end的时候去收集css rules，只有这个时候style tag里面的children才是收集全了，能拿到文本节点的css**。
     2. CSS Computing
         * 不同于在end tag的时候收集css rules，css computing的时机应该尽可能的早，尤其对于有很多子元素的元素比如main tag，如果放在end tag的时候计算，就要等很久，而main的子元素中如果有依赖于main的style的元素，就要在main的style计算之后，再此进行计算。**因此应该在每个element创建后，加上了tagName/attributes之后，进行计算**。理论上在计算element的css的时候，css规则已经全部收集完毕。
         * 计算过程
           * 判断当前元素是否匹配到css rules中的selector
             * 收集当前元素和它全部的父元素：只有收集完元素的所有父元素（因为在dom tree的时候已经把element.parent记录了，只需要一层层向上找即可收集完全），才可以知道selector是否选中了当前元素。判断顺序是从当前元素开始，从当前元素向上层parent寻找（从里往外找,e.g. <\img/> -> <\div> -> <\body>）
             * 拆分css rule里面的selector，也要拆分成从当前元素的selector向外/父亲的顺序（e.g #myid -> div -> body）;复杂选择器要拆分成单个元素的选择器，同循环匹配父元素队列
             * `match(selector,element)` ,TODO - 可以处理的 selector 有 ： # tagName > [attr=value]，以及复合选择器 多个class的选择器
           * 匹配之后加入element得computedStyle里面,准备计算优先级[specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#selector_types)
             * 参照[css level3里面的例子](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#specificity)，四元组（inline，id，class，tag），按照每个选择器出现的次数去增加`[0,0,0,0]`，然后从高位到低位比较(inline->tag)。
             * 为每个属性计算specificity，一起存进computedStyle里面，同样的属性比较specificity，然后高的覆盖低的。
4. Render ：Flex layout 
   1. flex layout preset
        * 确定main-axis/cross-axis，主轴就是flex-direction， 元素向哪个方向排布，交叉轴就是与主轴垂直的那个方位。
        * flex layout需要知道子元素，因此在end tag的时候调用layout
        * element.style预处理，px或者数字都parse成数字，方便后续layout计算位置；如果没有给element设置display:flex就当作它不存在;只排布非textnode的子元素。
        * 记录main-axis/cross-axis的变量：`mainSize,crossSize`记录主轴/交叉轴的行进单位width/height,`mainStart,mainEnd,crossStart,crossEnd`,记录主轴/交叉轴的起点/终点方向`mainBase,mainSign,crossBase,crossSign`记录主轴/交叉轴计算的起点和计算的符号
   2. 收集子元素进入元素内的“行”（flexLine，row或者col）
        * 根据主轴尺寸mainSize判断每“行”是否装满了，nowrap强行加入第一行，不然超了的元素归入第二行；
        * 将每个flexLine的主轴剩余空间mainSpace，和交叉轴所占空间crossSpace存入flexLine
        *  *optional可以实现flex grow和flex shrink*
   3. 找出元素的主轴尺寸：取决于justify-content
        * 找出所有flex元素，它们的size需要看mainSpace，然后平均分配给他们
        * 如果mainSpace是负数，所有flex元素size为零，其他元素等比压缩  
   4. 计算元素的交叉轴尺寸：取决于align-content/align-items/align-self，同时会受到flex-wrap:wrap-reverse的影响
        * 计算全部flexline的剩余交叉轴空间totalCrossSlot,然后通过align-content去分配flexline之间的交叉轴间距
        * 然后align-items/align-self去确定每flexline内剩余空间以及元素在交叉轴方向的位置


# 状态机
[JS中实现有限状态机](./FSM.js)
- 每个状态都是一个函数（纯函数，不依赖外部的环境来改变返回值）
  * 函数参数是一个输入
  * 在函数中编写当前状态的逻辑
  * 返回值为下一个状态（也是一个函数）
    * 如果return的next是个固定值，那就是Moore型的状态机
    * 如果return得next跟input有关，是个if else，那就是mealy型的状态机
- while循环调用状态函数
```js 
  function state(input){
    //do something
    return next//next state
  }
  while(input){
    //获取输入
    state = state(input)//把状态机的返回值（状态函数）作为下一个状态
  }
```

