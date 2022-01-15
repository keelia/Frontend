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

