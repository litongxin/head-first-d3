var http = require('http');
var sockjs = require('sockjs');
var jsonfile = require('jsonfile');

var echo = sockjs.createServer({sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'});
echo.on('connection', function (conn) {
  console.log('Connect with client!');
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
});

echo.installHandlers(server, {prefix: '/echo'});

server.listen(3000, '0.0.0.0');
console.log('Listening at localhost:3000');
