var http = require('http');
var sockjs = require('sockjs');
var jsonfile = require('jsonfile');

var echo = sockjs.createServer({sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'});
var connection = null;
echo.on('connection', function (conn) {
  console.log('Connect with client!');
  connection = conn;
  conn.on('data', function (message) {
    console.log('Received message from client:', message);
    conn.write(message);
  });
  conn.on('close', function () {
    console.log('Close with client.');
  });
});

var array = [];
var file = './data/bookmarks.json';

jsonfile.readFile(file, function (err, obj) {
  array = obj;
});


var server = http.createServer(function (req, res) {

  if (req.method === 'GET') {
    res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    res.end(JSON.stringify(array).toString());
  }
  else if (req.method === 'POST'){
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
      array.push(JSON.parse(Buffer.concat(body)));
      connection.write(JSON.stringify(array).toString());
      res.writeHead(200);
      res.end("Update successfully!");
    });
  }
});

echo.installHandlers(server, {prefix: '/echo'});

server.listen(3000, '0.0.0.0');
console.log('Listening at localhost:3000');
