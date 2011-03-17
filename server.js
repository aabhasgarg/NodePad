// server for collaborative pad
var http = require('http'),  
    io = require('socket.io'); // for npm, otherwise use require('./path/to/socket.io') 

var clients = [];

server = http.createServer(function(req, res){ 
 res.writeHead(200, {'Content-Type': 'text/html'}); 
 res.end('<h1>Hello world</h1>'); 
});
server.listen(8080);
  
// socket.io 
var socket = io.listen(server); 
socket.on('connection', function(client){ 
	var your_id = new Date().getTime();
	var client_data = {
		'client_id': your_id,
		'client': client
	};
	
	clients.push(client_data);
	
	//console.log(clients);
	
	client.on('connect', function(){
		//console.log(client_data);
	});
	
  	client.on('message', function(recv_message){
		
		if(recv_message.opcode == 'diff')
		{
			send_to_peers(recv_message);
		}
		
	});
	
	function send_to_peers(message_to_send)
	{
		for(var i = 0; i < clients.length; i++)
		{
			if(clients[i]['client_id'] != your_id)
			{
				clients[i]['client'].send(message_to_send);
			}
		}
	}
	
	function send_to_all(message_to_send)
	{
		for(var i = 0; i < clients.length; i++)
		{
			clients[i]['client'].send(message_to_send);
		}
	}
	 
  	client.on('disconnect', function(){
		console.log("Disconnected");
	}); 
});