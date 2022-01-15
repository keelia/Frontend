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
    res.end(`<html lang="en">
<head>
<style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
</style>
</head>
<body>
<div id="mdDiv" class="myDivCls" disabled>
    <img id="myid"/>
    <img />
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