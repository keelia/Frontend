const net = require('net');
const parser = require('./parser')

class Request{
    //method url=host+port+path
    //headers:Content-Type-default: application/x-www-form-urlencoded
    //body:k-v
    constructor(options){
        this.method  = options.method || 'GET'
        this.host = options.host
        this.port = options.port || 80
        this.path = options.path ||'/'
        this.body = options.body || {}
        this.headers = options.headers || {}
        if(!this.headers['Content-Type']){
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        if(this.headers['Content-Type'] === 'application/json'){
            this.bodyText = JSON.stringify(this.body)

        }else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
            this.bodyText = Object.keys(this.body).map(key=>`${key}=${encodeURIComponent(this.body[key])}`).join('&')
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }
    toString(){
        return `${this.method} ${this.path} HTTP/1.1
${Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`).join('\r\n')}

${this.bodyText}
`
    }

    send(connection){
        return new Promise((resolve,reject)=>{
            const respParser = new ResponseParser
            if(!connection){
                connection = net.createConnection({ 
                    host:this.host,
                    port:this.port,
                 }, () => {
                    connection.write(this.toString());
                  });
            }else{
                connection.write(this.toString());
            }
            connection.on('data', (data) => {
                respParser.receive(data.toString())
                if(respParser.isFinished){
                    resolve(respParser.response)
                }
                connection.end();
            });
            connection.on('end', () => {
                console.log('disconnected from server');
            });
            connection.on('error', (err) => {
                reject(err)
                connection.end();
            });
        })

    }
}

class Response{
    
}

class ResponseParser{
    constructor(){
        this.WAITING_STATUES_LINE = 0
        this.WAITING_STATUES_LINE_END = 1//\r\n
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;//name:[space]value
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;//\r\n
        this.WAITING_HEADER_BLOCK_END = 6//empty line
        this.WAITING_BODY = 7
        this.current = this.WAITING_STATUES_LINE;
        this.status_line = '';
        this.headers = {};
        this.headerName= ''
        this.headerValue= ''
        this.bodyParser = null;//initiate after finishing parsing header:WAITING_BODY
    }
    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response(){
        this.status_line.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)// Status-Line = HTTP-Version SP Status-Code SP Reason-Phrase CRLF.HTTP/1.1 200 OK;
        return {
            statusCode:RegExp.$1,
            statusText:RegExp.$2,
            headers:this.headers,
            body:this.bodyParser.content.join('')
        }
    }
    receive(string){//buffer ｜ string
        for (let index = 0; index < string.length; index++) {
            this.receiveChar(string.charAt(index))
        }
    }
    receiveChar(char){
        switch (this.current) {
            case this.WAITING_STATUES_LINE:
                if(char === '\r'){
                    this.current = this.WAITING_STATUES_LINE_END;
                }else if(char === '\n'){
                    this.current = this.WAITING_HEADER_NAME;
                }else{
                    this.status_line+=char
                }
                break;
            case this.WAITING_STATUES_LINE_END:
                if(char === '\n'){
                    this.current = this.WAITING_HEADER_NAME;
                }
                break;
            case this.WAITING_HEADER_NAME:
                if(char === ':'){
                    this.current = this.WAITING_HEADER_SPACE;
                }else if(char === '\r'){
                    this.current = this.WAITING_HEADER_BLOCK_END;
                }else{
                    this.headerName+=char;
                }
                break;
            case this.WAITING_HEADER_SPACE:
                if(char === ' '){
                    this.current = this.WAITING_HEADER_VALUE;
                }
                break;
            case this.WAITING_HEADER_VALUE:
                if(char === '\r'){
                    this.current = this.WAITING_HEADER_LINE_END;
                    this.headers[this.headerName] = this.headerValue;
                    this.headerName = ''
                    this.headerValue = ''
                }else{
                    this.headerValue+=char;
                }
                break;
            case this.WAITING_HEADER_LINE_END:
                if(char === '\n'){
                    this.current = this.WAITING_HEADER_NAME;
                };
                break;
            case this.WAITING_HEADER_BLOCK_END:
                if(char === '\n'){
                    this.current = this.WAITING_BODY;
                    if(this.headers['Transfer-Encoding'] === 'chunked'){
                        this.bodyParser = new TrunkedBodyParser
                    }
                }
                break;
            case this.WAITING_BODY:
                this.bodyParser.receiveChar(char)
            default:
                break;
        }
    }
}
class TrunkedBodyParser{
    //body是一行十六进制数代表接下来有多少个字符的内容；转行后开始内容；循环直到结束。
    constructor(){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END=1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length =0;
        this.content = [];
        this.current = this.WAITING_LENGTH;
        this.isFinished = false;
    }
   
    receiveChar(char){
        if(this.isFinished){
            return;
        }
        switch (this.current) {
            case this.WAITING_LENGTH:
                if(char === '\r'){
                    this.current = this.WAITING_LENGTH_LINE_END;
                    if(this.length ===0 ){
                        this.isFinished = true;
                    }
                }else{
                    //因为length都是十六进制数，一层一层往上加；得到length的长度
                    this.length *= 16;
                    this.length +=parseInt(char,16);
                }
                break;
            case this.WAITING_LENGTH_LINE_END:
                if(char === '\n'){
                    this.current = this.READING_TRUNK;
                }
                break;
            case this.READING_TRUNK:
                this.content.push(char)
                this.length--;
                if(this.length === 0){
                    this.current = this.WAITING_NEW_LINE
                }
                break;
            case this.WAITING_NEW_LINE:
                if(char==='\r'){
                    this.current = this.WAITING_NEW_LINE_END
                }
                break;
            case this.WAITING_NEW_LINE_END:
                if(char==='\n'){
                    this.current = this.WAITING_LENGTH
                }
                break;
            default:
                break;
        }
    }
}

void async function(){
    let request = new Request({
        method:'POST',
        host:"127.0.0.1",
        port:'8088',
        body:{
            name:'winter'
        },
        headers:{
            ['X-Foo222']:'customed'
        }
    });
    let response = await request.send();
    let dom = parser.parseHTML(response.body)
}()


// const client = net.createConnection({ port: 8088 }, () => {
//     console.log('connected to server!');
//     let request = new Request({
//         method:'POST',
//         host:"127.0.0.1",
//         port:'8088',
//         body:{
//             name:'winter'
//         },
//         headers:{
//             ['X-Foo2']:'customed'
//         }
//     })
//     client.write(request.toString());
// //     client.write(`POST / HTTP/1.1
// // Host: http://127.0.0.1/
// // Content-Type: application/x-www-form-urlencoded

// // field1=value1&field2=value2
// // `);
//     // client.write('POST / HTTP/1.1\r\n');
//     // client.write('Host: http://127.0.0.1/\r\n');
//     // client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//     // client.write('\r\n');
//     // client.write('field1=value1&field2=value2\r\n');
//   });
//   client.on('data', (data) => {
//     console.log(data.toString());
//     client.end();
//   });
//   client.on('end', () => {
//     console.log('disconnected from server');
//   });