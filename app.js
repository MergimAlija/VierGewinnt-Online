var express = require('express');
var app = express();

//Kreiiere einen Server (localhost) und hör auf den Port 2000
var serv = require('http').Server(app);

app.get('/',function(req,res){

	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
serv.maxConnections = 2;

console.log("Server started");
var SOCKET_LIST = {};


//laedt das Modul und initialisiert alles aus der Library
var io = require ('socket.io')(serv,{});

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

io.sockets.on('connection',function(socket){
	var connectedClients = io.engine.clientsCount;
	socket.emit('playername', socket.id);

	nicknames.push(socket.id)

	//console.log("ARRAY:"+nicknames);
	SOCKET_LIST[socket.id] = socket;

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
			//console.log("data2:"+data2);
			//console.log("nickname0"+nicknames[0]);

			if(nicknames[0]==data2){
				x[x_coor][y_coor] = "X";
			}else{
				x[x_coor][y_coor] = "O";
			}
   				io.sockets.emit('addToChat',socket.id+' has played');
   				var d2 = makeTableHTML(x);

				for(var i in SOCKET_LIST){
				SOCKET_LIST[i].emit('refreshTable', d2);
				
				}
   			
    });

 
/*
    	  	socket.on('checke',function(data){
				
				for(var i =0; i<6; i++){
					for(var j =0; j<7; j++){
						if(x[i][j]=='X' && x[i][j+1]=='X' && x[i][j+2]=='X' && x[i][j+3]=='X'){
							console.log("won_spalte");
						}
					}
				}

					for(var i =0; i<6; i++){
						for(var j =0; j<7; j++){
							if(x[i][j]=='X' && x[i+1][j]=='X' && x[i+2][j]=='X' && x[i+3][j]=='X'){
								console.log("won_zeile");
							}
					}
				}

					for(var i =0; i<6; i++){
						for(var j =0; j<7; j++){
							if(x[i][j]=='X' && x[i+1][j+1]=='X' && x[i+2][j+2]=='X' && x[i+3][j+3]=='X'){
								console.log("won_diagonal");
							}
					}
				}
		
	});
	*/

});
