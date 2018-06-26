// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom
const sockets = []
var numUsers = 0;
var  connectionsSoFar = 0
io.on('connection', (socket) => {
  /*console.log('there was a connection')
  connectionsSoFar++
  socket.emit('hello', connectionsSoFar)
  socket.on('ok',function(){
    console.log('client sent ok')
  })*/

  sockets.push(socket)
  var username

  socket.on('im', function(_username) {
    username = _username
  })

  socket.on('msg', function(msg) {
    sockets.forEach(socket => socket.emit('msg',`${username}: ${msg}`))
  })

  socket.on('disconnect', function(){
    sockets.splice(sockets.find(socket), 1)
  })

  //socket.broadcast.emit

});