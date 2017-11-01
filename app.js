var express = require('express');
var io = require ('socket.io')(serv,{});
var app = express();
//Kreiiere einen Server (localhost) und hör auf den Port 2000
var serv = require('http').Server(app);

//Routing
app.get('/',function(req,res){
	res.sendFile(__dirname + '/client/signon.html');
});

app.use('/client', express.static(__dirname + '/client'));
// parse application/x-www-form-urlencoded


serv.listen(2000);
//serv.maxConnections = 2;

console.log("Server started");
var SOCKET_LIST = {};

//INITIALISIERUNG ARRAY
	var x = new Array(5);
	
	for (var i = 0; i < 6; i++) {
		x[i] = new Array(7);
	}

	for (var j = 0; j < 6; j++) {
		for (var k = 0; k < 7; k++) {
			x[j][k] = '';
		}
	}

var nicknames = [];
var users = [];

io.sockets.on('connection',function(socket){
	var connectedClients = io.engine.clientsCount;
	socket.emit('playername', socket.id);
	socket.emit('addToChat', 'Willkommen <i><b>'+socket.id+'</b></i>!');
	nicknames.push(socket.id);
	SOCKET_LIST[socket.id] = socket;
	console.log(Object.keys(io.engine.clients));

	//INITIALISIERUNG MACHE AUS ARRAY EINE TABELLE
	function makeTableHTML(myArray) {
	    var result = "<table id='playground'>";
	    for(var i=0; i<myArray.length; i++) {
	        result += "<tr>";
	        for(var j=0; j<myArray[i].length; j++){
	            result += "<td id='"+i+''+j+"' onclick='test(this)'>"+myArray[i][j]+"</td>";
	        }
	        result += "</tr>";
	    }
	    result += "</table>";
	    return result;
	}

	var d = makeTableHTML(x);

	for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('init', d);
			SOCKET_LIST[i].emit('playing', socket.id);
			SOCKET_LIST[i].emit('totalplayer', connectedClients);
			}

	socket.on('disconnect', function(){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat', 'Ciao Player '+socket.id);
			}
		delete SOCKET_LIST[socket.id];
	});

	socket.on('sendMsgToServer',function(data){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat', socket.id+": "+data);
			}
	});

	socket.on('cellClicked', function(data,data2){
		 var x_coor = data.substring(0,1);
   		 var y_coor= data.substring(1,2);
   		 
			if(nicknames[0]==data2){
				x[x_coor][y_coor] = "X";
			}else{
				 x[x_coor][y_coor] = "O";
			}
   				var d2 = makeTableHTML(x);
	   		for(var i in SOCKET_LIST){
				SOCKET_LIST[i].emit('refreshTable', d2);
			}
    });

    	function lockTableHTML(myArray) {
	    var result = "<table id='playground'>";
	    for(var i=0; i<myArray.length; i++) {
	        result += "<tr>";
	        for(var j=0; j<myArray[i].length; j++){
	            result += "<td id='"+i+''+j+"' >"+myArray[i][j]+"</td>";
	        }
	        result += "</tr>";
	    }
	    result += "</table>";
	    return result;
	}

 });