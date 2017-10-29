var express = require('express');
var server = express();

//Kreiiere einen Server (localhost) und hör auf den Port 2000
var serv = require('http').Server(server);

server.get('/',function(req,res){

	res.sendFile(__dirname + '/client/indextemp.html');
});

server.use('/client', express.static(__dirname + '/client'));
server.use('/Template', express.static(__dirname + 'Template/stylesheet.css'));


serv.listen(2000);
serv.maxConnections = 2;

console.log("Server started");
var SOCKET_LIST = {};


//laedt das Modul und initialisiert alles aus der Library
var io = require ('socket.io')(serv,{});





	

