const http = require('http');

const server = http.createServer((req, res) => {
    console.log('Request received:')
    console.log(req.headers)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`
<html>
  <head>
  <style>
  body {background-color: powderblue;}
  h1   {color: blue;}
  p    {color: red;}
  </style>
  </head>
  <body>
  
  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>
  
  </body>
</html>`);
  });
  server.listen(8088)