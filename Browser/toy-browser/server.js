const http = require('http');

const server = http.createServer((req, res) => {
    //console.log('Request received:')
    // console.log(req.headers)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
// res.end(`
// <div id="mdDiv" class="myDivCls" disabled>
//     <img id="myid"/>
// </div>`);
//   });
    res.end(`<html>
<head>
<style>
#myDiv{
    display: flex;
    width:120px;
    flexWrap:wrap-reverse;
    background-color: rgb(255, 80, 0);
    height: 120px;
}
#div1{
    width:30px;
    background-color: rgb(157, 184, 84);
    height: 30px;
}
#div2{
    width:60px;
    background-color: rgb(69, 17, 255);
    height: 60px;
}
#div3{
    width:40px;
    background-color: rgb(238, 204, 55);
    height: 40px;
}
a , div.nested{
    width: 10px;
    height: 10px;
    background-color: rgb(15 ,234 ,3);
}
a[class~=title]{
    background-color: rgb(111, 111, 111);
}

a.second-nested[href*="example"]{
    background-color: rgb(33, 33, 33);
}

div div.third-nested{
    height: 60px;
}
</style>
</head>
<body>
<div id="myDiv">
    <div id="div1"></div>
    <div id="div2" class="cls2"></div>
    <div id="div3" class="cls3"></div>
    <a id="titleA" class="nested first-nested title"></a>
    <a class="nested second-nested" href="http://example"></a>
    <div class="nested third-nested"></div>
</div>
</body>
</html>`);
  });
  server.listen(8088)



// res.end(`
// <html maaa=a >
// <head>
//     <style>
// body div #myid{
//     width:100px;
//     background-color: #ff5000;
// }
// body div img{
//     width:30px;
//     background-color: #ff1111;
// }
//     </style>
// </head>
// <body>
//     <div id="mdDiv" class="myDivCls">
//         <img id="myid"/>
//         <img />
//     </div>
// </body>
// </html>
// `);