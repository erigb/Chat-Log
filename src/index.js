const formatMessage = require('./messages.js');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
  changeName,
  changeColor,
  existingUser
} = require('./users');

var messageList = []

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1709;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var user = userJoin(socket.id);
    
    io.to(socket.id).emit('check cookies');

    messageList.forEach(indiMessage=>{
        io.to(socket.id).emit('chat message', [formatMessage(indiMessage[0].username, indiMessage[1]),indiMessage[0].color]);
    });
    io.to(socket.id).emit('chat message', ['Welcome to the chat!', '#000000']);
    socket.broadcast.emit('chat message', [user.username + ' Has Joined!', '#000000']);

    io.emit('update users', getUsers());

    socket.on('cookies check', function(prevUser){ //Make
      changeName(socket.id, prevUser[0]);
      var newColor = prevUser[1].replace('#', '');
      changeColor(socket.id, newColor);
      io.emit('update users', getUsers());
      io.to(socket.id).emit('update local storage', getCurrentUser(socket.id));
    });

  socket.on('chat message', function(msg){
      const us = getCurrentUser(socket.id);
      if (msg.startsWith('/name '))  {
        io.to(socket.id).emit('hide error');
        changeName(socket.id, msg);
        io.emit('update users', getUsers());
        io.to(socket.id).emit('update local storage', getCurrentUser(socket.id));
      }

      else if (msg.startsWith('/color '))  {
        io.to(socket.id).emit('hide error');
        changeColor(socket.id, msg);
        io.emit('update users', getUsers());
        io.to(socket.id).emit('update local storage', getCurrentUser(socket.id));
      } 

      else if (msg.startsWith('/'))  {
        io.to(socket.id).emit('show error');
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
    userLeave(socket.id);
    io.emit('update users', getUsers());

});  
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});