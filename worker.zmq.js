var zmq = require('zmq'),
    sock = zmq.socket('router');

var servers = require('/srv/node/config/servers.js');
var helenus = require('helenus');
var m = require('/srv/node/global/models.js');

var pool = new helenus.ConnectionPool({
        hosts      : servers.CASSANDRA.hosts,
        keyspace   : 'logger',
        user       : servers.CASSANDRA.user,
        password   : servers.CASSANDRA.password,
        timeout    : 3000
        //cqlVersion : '3.0.0' // specify this if you're using Cassandra 1.1 and want to use CQL 3
    });

var address = process.argv[2],
	options = JSON.parse(process.argv[3]);

var N = 10000,
	i = 0,
	t;

//console.log(address)
console.log(address)
sock.bindSync(address);
pool.connect(function(err, keyspace){
	process.send({connected: true})
	console.log('Worker started at ' + address);
	
	sock.on('message', getMessageProcessFunction(options));
})

function getMessageProcessFunction(options){
	if(options.json)
		if(options.ack)
			return jsonAckProcesser;
		else
			return jsonProcesser;
	else
		if(options.ack)
			return ackProcesser;
		else
			return simpleProcesser;		
}

function getTextDate(date){
    var day = '' + date.getFullYear();
    day += (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    day += (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    return day;
}

function simpleProcesser(env, msg, callback){
	insertLog(msg.toString());		
}

function jsonProcesser(env, msg, callback){
	msg = JSON.parse(msg.toString());
	insertLog(msg)
}

function ackProcesser(env, msg, callback){
	insertLog(msg.toString(), function(){
		sock.send([env, ack]);	
	})	
}

function jsonAckProcesser(env, msg, callback){
	msg = JSON.parse(msg.toString());
	insertLog(msg)
	sock.send([env, ack]);
}

function insertLog(msg, callback){
	msg = msg
	var data = [(new Date()).getTime()];
	var cql = 'INSERT INTO test (KEY,';
	/*for(var i in msg)
		cql += "" + i + ",";
	cql = cql.substring(0, cql.length - 1);
	cql += ") VALUES (?,";
	for(var i in msg){
		cql += '?,';
		data.push(JSON.stringify(msg[i]))
	}
	cql = cql.substring(0, cql.length - 1);
	cql += ');';
	//data.push((new Date()).getTime())*/
	cql = 'INSERT INTO test (KEY, ?) VALUES (?, ?)';
	data = [helenus.TimeUUID.fromTimestamp(new Date()), getTextDate(new Date()), JSON.stringify(msg)];
	console.log(cql, data)

	//console.log(data)
	//pool.cql("INSERT INTO log (KEY, ?, ?) VALUES (?, ?, ?);", ['code', 'url', (new Date()).getTime(), 404, '/user'], function(err, results){
	pool.cql(cql, data, function(err, results){
	    if(err){
	      //TODO Log error
	      console.log(err);
	      //return;
	    }          
	    if(callback && typeof(callback) == 'function')
	    	callback(err, res)      
	});

	if(!t)
		t = (new Date()).getTime();
	if(++i == N){
		process.send({recived: 10000, startT: t, finishT: (new Date()).getTime()});
		process.exit();
	}
}