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
console.log(__dirname);

var SOCKET_LIST = {};

//laedt das Modul und initialisiert alles aus der Library
var io = require ('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	//INITIALISIERUNG ARRAY
	var x = new Array(5);
	
	for (var i = 0; i < 6; i++) {
		x[i] = new Array(7);
	}

	for (var j = 0; j < 6; j++) {
		for (var k = 0; k < 7; k++) {
			x[j][k] = j+''+k;
		}
	}

	//INITIALISIERUNG MACHE AUS ARRAY EINE TABELLE
	function makeTableHTML(myArray) {
	    var result = "<table id='playground' border=1>";
	    for(var i=0; i<myArray.length; i++) {
	        result += "<tr>";
	        for(var j=0; j<myArray[i].length; j++){
	            result += "<td id="+i+''+j+">"+myArray[i][j]+"</td>";
	        }
	        result += "</tr>";
	    }
	    result += "</table>";
	    return result;
	}

	var d = makeTableHTML(x);

	for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('init', d);
			}

	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
	});

	socket.on('sendMsgToServer',function(data){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat', data);
			}
	});

	socket.on('cellClicked', function(data){
        for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('refreshTable', data);
			} 

    });

});

setInterval(function(){
	
	/*var pack = [];
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		

		pack.push({
			x:socket.y,
			y:socket.y
		});


	}
	for (var i in SOCKET_LIST){
		socket.emit('newPositions',pack);
	} */
},1000/25);
