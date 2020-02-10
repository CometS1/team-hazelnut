const socket_io = require('socket.io');
const io = socket_io();
const socketApi = {};
const Profile = require('../models/Profile');
const Message = require('../models/Message');

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');

    socket.on("new message", function(msg) {
      io.emit("new message", msg);
    });
      
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});

module.exports = socketApi;