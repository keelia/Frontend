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
