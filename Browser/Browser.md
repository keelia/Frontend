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
            2. 因为tcp的数据是流式，因此没有办法用正则（无法保证一个chunked片段(*TrunkedBodyParser*)过来的时候刚好断在正确的位置，如`Content-Type: text/plain；Date: Sat, 08 （断在此处）Jan 2022 20:03:42 GMT`），而只能用状态机。
