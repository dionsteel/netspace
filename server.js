var Server = require('voxel-server')
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
})
server.on('client.join', function(client){ 
	//things
	console.log(client);
})
server.on('client.leave', function(client){ 
	//things
	console.log(client);
})
server.on('client.state', function(state){  
	//things
	console.log(state);
})
server.on('chat', function(message){  
	//things
	console.log(message);
})
server.on('set', function(pos, val, client){  
	//things
	console.log(pos,val, client);
})
server.on('error', function(error){  
	//things
	console.log(error);
})

// connect a client
// var duplexStream = SomeTransportSteam()
// server.connectClient(duplexStream)

var webserver = http.createServer(ecstatic(path.join(__dirname, 'www')))
var wss = new WebSocketServer({server: webserver})

wss.on('connection', function(ws) {
	// turn 'raw' websocket into a stream
	var stream = websocket(ws);
	server.connectCLient(stream);
});