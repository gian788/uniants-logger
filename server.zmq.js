var zmq = require('zmq'),
    sock = zmq.socket('router'),
    childProcess = require('child_process');

var address = 'tcp://127.0.0.1'
	port = 3003,
	portI = 1;

sock.bindSync(address + ':' + port);
console.log('Server started at ' + address + ':' + port);
 
var i = 0,
	ic = 0,
	ts,
	tf,
	N = 10000,
	NC = 10; 

/** 
Test Dealer - Router (N - 1) 10.000 msg * 10 client:	
	simple: 	2702 ms
	json: 		4024 ms
	ack: 		5220 ms
	ack+json: 	6927 ms

Performance:
	json: 		+  48 %
	ack: 		+  93 %
	ack+json: 	+ 156 %
	
**/
function setClientOption(options){
	var opt = {}
	for(var o in options){
		switch(o){
			case 'json':
			case 'ack':
				if(typeof(options[o]) == 'boolean')
					opt[o] = options[o];
			break;
		}
	}
	return opt;
}

function generateNewAddress() {
	return address + ':' + (port + portI++);
}

sock.on('message', function(env, msg){		
	msg = JSON.parse(msg)
	console.log(msg)
	if(msg.req == 'boot'){
		var clientAddress = generateNewAddress()
		console.log(msg.data)
		var proc = childProcess.fork('./worker.zmq.js', [clientAddress, JSON.stringify(msg.data)]);
		proc.on('message', function(m){
			if(m.connected){
				sock.send([env, JSON.stringify({msg: 'ok', address: clientAddress})]);		
			}
			if(m.recived){
				i += m.recived;
			
  				if(!ts)
					ts = m.startT
				if(m.startT < ts)
					ts = m.startT

				if(!tf)
					tf = m.finishT
				if(m.finishT > tf)
					tf = m.finishT

				console.log(m.recived/(m.finishT - m.startT) * 1000 + ' m/s')
				console.log(++ic, 'recived ' + i + ' messages in ' + (m.finishT - m.startT) + ' ms');

				if(i == N * NC)
  					console.log('\nrecived ' + N * NC + ' messages in ' + (tf - ts) + ' ms');
			}
		})	
	}
});
