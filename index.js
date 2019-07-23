module.exports = function(sd) {
	const io = require('socket.io')(sd.server, { origins: '*:*'});
	const io_connections = [function(socket){
		socket.on('public', function(content){
			socket.broadcast.emit('public', content);
		});
	}];
	io.on('connection', function (socket) {
		if (socket.request.user) {
			socket.join(socket.request.user._id);
		}
		for (var i = 0; i < io_connections.length; i++) {
			if(typeof io_connections[i] == 'function'){
				io_connections[i](socket);
			}
		}
	});
	/*
	*	Helpers
	*/
	sd.io_connect = function(func){
		if(typeof func == 'function'){
			io_connections.push(func);
		}
	}
	sd.io = io;
};