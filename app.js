var express = require('express');
var app = express();

//Kreiiere einen Server (localhost) und hör auf den Port 2000
var serv = require('http').Server(app);

app.get('/',function(req,res){
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started");

var SOCKET_LIST = {};

//laedt das Modul und initialisiert alles aus der Library
var io = require ('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;
	socket.number = ""+Math.floor(10*Math.random());

	SOCKET_LIST[socket.id] = socket;

	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
	});

	socket.on('sendMsgToServer',function(data){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat', data);
		}

	});
});

setInterval(function(){
	var pack = [];
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		

		pack.push({
			x:socket.y,
			y:socket.y
		});


	}
	for (var i in SOCKET_LIST){
		socket.emit('newPositions',pack);
	}
},1000/25);

