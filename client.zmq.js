var zmq = require('zmq')
  , sock = zmq.socket('dealer');

var server = 'tcp://127.0.0.1:3003';

sock.connect(server);
//console.log('Client connecting to ' + server);

sock.send([JSON.stringify({req:'boot', json: true, ack: false})])
var connected = false;
sock.on('message', function(msg){
	if(!connected){
		msg = JSON.parse(msg);
		if(msg.msg == 'ok'){
			sock.disconnect(server);
			sock.connect(msg.address)
			console.log('Connected to ' + msg.address + '!')	
			var N = 1,
			cack = 0;
			var t = (new Date()).getTime();

			for(var i = 0; i < N; i++)
				sock.send(JSON.stringify({data:'log', level: 3, id: 5}))
				//sock.send('log' + i)		
			return;
		}
		

		
		
	}
	
	
	if(++cack == N){
		console.log('send ' + N + ' messages in ' + ((new Date()).getTime() - t) + ' ms');
		process.exit();
	}
})


