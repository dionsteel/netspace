var Server = require('voxel-server-ns')
var WebSocketServer = require('ws').Server
var websocket = require('websocket-stream')
var http = require('http')
var ecstatic = require('ecstatic')
var path = require('path')

var settings = {
  // various [voxel-engine]() settings to be sent to the clients
  avatarInitialPosition: [2, 20, 2],
  // list of incomming custom events to forward to all clients
  forwardEvents: ['attack','voiceChat']
}

// create server
var server = Server(settings)

// bind events
server.on('missingChunk', function(chunk){  
	console.log("missingChunk", chunk);
})
server.on('client.join', function(client){ 
	//things
	console.log('client.join',client);
})
server.on('client.leave', function(client){ 
	//things
	console.log("client.leave",client);
})
server.on('client.state', function(state){  
	//things
	console.log("client.state", state);
})
server.on('chat', function(message){  
	//things
	console.log("chat:", message);
})
server.on('set', function(pos, val, client){  
	//things
	console.log("set:", pos,val, client);
})
server.on('error', function(error){  
	//things
	console.log("error", error);
})

// connect a client
// var duplexStream = SomeTransportSteam()
// server.connectClient(duplexStream)

var webserver = http.createServer(ecstatic(path.join(__dirname, 'www')))
var wss = new WebSocketServer({server: webserver})

wss.on('connection', function(ws) {
	// turn 'raw' websocket into a stream
	var stream = websocket(ws);
	console.log("CONNECTIOn!");
	server.connectClient(stream);
});

webserver.listen(8080);
console.log("listening on port 8080");