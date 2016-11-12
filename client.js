var Client = require("voxel-client");
var wsclient = require("ws").Client;
var websocket = require('websocket-stream');

var duplexStream = websocket("ws://localhost:8080");

var client = new Client({
  serverStream: duplexStream,
  container: document.body,
})

// use the client.connection [DuplexEmitter](https://github.com/pgte/duplex-emitter) to react to remote events
client.connection.on('join', function(user) {
  console.log(user,'joined.')
})
