var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];

    app.use('/', express.static(__dirname + '/main'));
    server.listen(process.env.PORT || 3000);

    io.on('connection', function (socket) {

    socket.on('login', function (nickname) {
        if (users.indexOf(nickname) > -1){
            socket.emit("nickExisted");
        }else{
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');

            io.sockets.emit('System', nickname, users.length, 'login');
        }
    });
    socket.on('disconnect', function () {
        users.splice(socket.userIndex, 1);
        socket.broadcast.emit('System', socket.nickname, users.length, 'logout');
    });

    socket.on('postMsg', function (msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });

    socket.on('img', function (imgData) {

        socket.broadcast.emit('newImg',socket.nickname, imgData);
    });
});