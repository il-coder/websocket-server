const wsl = require('ws');
const http = require('http');
const url = require('url');
const server = http.createServer();

let wssList = [];

for(let i = 1; i <= 1000; i++) {  
  let wss = new wsl.WebSocketServer({ noServer : true });
  wssList.push(wss);
  wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === wsl.WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });
  });
}

// const wss = new wsl.WebSocketServer({ port: server });

console.log("Working.........");

server.on('upgrade', function upgrade(request, socket, head) {
  let { pathname } = url.parse(request.url);
  console.log(pathname);
  pathname = parseInt(pathname.replace('/',''));
  console.log(pathname);
  if (!isNaN(pathname)) {
    console.log(pathname);
    wssList[pathname].handleUpgrade(request, socket, head, function done(ws) {
      wssList[pathname].emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});


server.listen(8080);
