const formatMessage = require('./messages.js');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
  changeName,
  changeColor
} = require('./users');

var messageList = []

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    const user = userJoin(socket.id);

    messageList.forEach(indiMessage=>{
        io.to(socket.id).emit('chat message', [formatMessage(indiMessage[0].username, indiMessage[1]),indiMessage[0].color]);
    });
    io.to(socket.id).emit('chat message', ['Welcome to the chat!', '#000000']);
    socket.broadcast.emit('chat message', [user.username + ' Has Joined!', '#000000']);

    io.emit('update users', getUsers());

  socket.on('chat message', function(msg){
      const us = getCurrentUser(socket.id);
      if (msg.startsWith('/name '))  {
        io.to(socket.id).emit('hide error');
        changeName(socket.id, msg);
        io.emit('update users', getUsers());
      }

      else if (msg.startsWith('/color '))  {
        io.to(socket.id).emit('hide error');
        changeColor(socket.id, msg);
        io.emit('update users', getUsers());
      } 

      else if (msg.startsWith('/'))  {
        io.to(socket.id).emit('show error');
        console.log("ERROR in command0");
      }
      else {
        io.to(socket.id).emit('hide error');
        const mess = [getCurrentUser(socket.id), msg];
        messageList.push(mess);
         io.to(socket.id).emit('chat message', [formatMessage("You", msg).bold(),us.color]);
        socket.broadcast.emit('chat message', [formatMessage(us.username, msg), us.color]);
      }
  });

  socket.on('disconnect', function(){
    io.emit('chat message', [getCurrentUser(socket.id).username + ' Has Left!', '#000000']);
    const user = userLeave(socket.id);
    io.emit('update users', getUsers());

});  
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});