var createError = require('http-errors');
var express = require('express');
var app=express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid');
var roomInfo={}
app.use(express.static(path.resolve(__dirname,'public')));
app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});
app.get('/rooms',function (req,res) {
	res.sendFile(__dirname+'/rooms.html');
});
app.get('/room',function (req,res) {
	res.sendFile(__dirname+'/room.html');
})
io.on('connection',function (socket) {
    var url = socket.request.headers.referer;
    var splited = url.split('?');
    var roomID = splited[splited.length - 1];   // 获取房间ID
    var user = '';
    socket.to(roomID).emit('connect', user + '加入了房间', roomInfo[roomID]);
    socket.on('join',function (username) {
        user=username;
        if(!roomInfo[roomID]){
            roomInfo[roomID]=[];
        }
        roomInfo[roomID].push(user);
        socket.join(roomID);    // 加入房间
        // 通知房间内人员
        io.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);
        console.log(user + '加入了' + roomID);
    })
    socket.on('leave', function () {
        io.emit('disconnect');
    });

    socket.on('disconnect', function () {
        // 从房间名单中移除
        var index = roomInfo[roomID].indexOf(user);
        if (index !== -1) {
            roomInfo[roomID].splice(index, 1);
        }
        socket.leave(roomID);    // 退出房间
        io.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
        console.log(user + '退出了' + roomID);
    });

    // 接收用户消息,发送相应的房间
    socket.on('message', function (msg) {
        // 验证如果用户不在房间内则不给发送
        if (roomInfo[roomID].indexOf(user) === -1) {
            return false;
        }
        console.log(msg);
        io.to(roomID).emit('msg', user, msg);
    });
})


http.listen(process.env.PORT || 3000);
