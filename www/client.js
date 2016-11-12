var Client = require("voxel-client-ns");
var wsclient = require("ws").Client;
var websocket = require('websocket-stream');
var highlight = require('voxel-highlight')
var extend = require('extend')
var voxelPlayer = require('voxel-player')


var duplexStream = websocket("ws://192.168.0.107:8080");
var setup = defaultSetup;
var client = new Client({
  serverStream: duplexStream,
  container: document.body,
})

// use the client.connection [Duplexconnection](https://github.com/pgte/duplex-connection) to react to remote events
client.connection.on('join', function(user) {
  console.log(user,'joined.')
})

console.log( client);

client.connection.on('noMoreChunks', function(id) {
	console.log("Attaching to the container and creating player")
	var container = document.body
	game = client.game
	game.appendTo(container)
	if (game.notCapable()) return game
	var createPlayer = voxelPlayer(game)

	// create the player from a minecraft skin file and tell the
	// game to use it as the main player
	var avatar = createPlayer('player.png')
	window.avatar = avatar
	avatar.possess()
	var settings = game.settings.avatarInitialPosition
	avatar.position.set(settings[0],settings[1],settings[2])
	setup(game, avatar, client)
})

function defaultSetup(game, avatar, client) {
  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0xff0000 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
    if (ev.keyCode === 'C'.charCodeAt(0)) {
      console.log(avatar, game, client);
    }
  })

  console.log("so far");
  // block interaction stuff, uses highlight data
  var currentMaterial = 1

  game.on('fire', function (target, state) {
    var position = blockPosPlace
    console.log("fire");
    if (position) {
      game.createBlock(position, currentMaterial)
      client.connection.emit('set', position, currentMaterial)
    } else {
      position = blockPosErase
      if (position) {
        game.setBlock(position, 0)
        console.log("Erasing point at " + JSON.stringify(position))
        client.connection.emit('set', position, 0)
      }
    }
  })
}