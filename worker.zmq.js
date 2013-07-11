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

var processors = {
	'error': 1,
	'event': 2,
	'request': 3
}

var handleMessage,
	processMessage;

sock.bindSync(address);
pool.connect(function(err, keyspace){
	process.send({connected: true})
	console.log('Worker started at ' + address);
	//console.log(options)
	setMessageProcessFunction(options)
	
	sock.on('message', handleMessage);
})

function setMessageProcessFunction(options){
	switch(options.logType){
		case 'event':
			processMessage = insertEvent;
		break;
		case 'error':
			processMessage = insertError;
		break;
		case 'request':
			processMessage = insertRequest;			
		break;		
		default:
			processMessage = insertLog;
		break;
	}

	if(options.json)
		if(options.ack)
			handleMessage = jsonAckHandler;
		else
			handleMessage = jsonHandler;
	else
		if(options.ack)
			handleMessage = ackHandler;
		else
			handleMessage = simpleHandler;		
}

/** Handler function **/

function simpleHandler(env, msg, callback){
	processMessage(msg.toString());		
}

function jsonHandler(env, msg, callback){
	console.log(msg.toString())
	msg = JSON.parse(msg.toString()).data;
	processMessage(msg);
}

function ackHandler(env, msg, callback){
	processMessage(msg.toString(), function(){
		sock.send([env, ack]);	
	});	
}

function jsonAckHandler(env, msg, callback){
	msg = JSON.parse(msg.toString()).data;
	processMessage(msg, function(){
		sock.send([env, ack]);
	});
}

/** Database insert function **/

function insertLog(msg, cf, callback){
	var data = [(new Date()).getTime()];
	cql = 'INSERT INTO ' + cf + ' (KEY, ?) VALUES (?, ?)';
	data = [helenus.TimeUUID.fromTimestamp(new Date()), getTextDate(new Date()), JSON.stringify(msg)];
	//console.log(cql, data);
	pool.cql(cql, data, function(err, results){
	    if(err){
	      //TODO Log error
	      console.log(err);
	      return;
	    }          
	    if(callback && typeof(callback) == 'function')
	    	callback(err, res);    
	});

	if(!t)
		t = (new Date()).getTime();
	if(++i == N){
		process.send({recived: 10000, startT: t, finishT: (new Date()).getTime()});
		process.exit();
	}
}

function insertCounters(msg, cf, callback){
	var counters = msg;
	var data = [];
	var cql = 'UPDATE ' + cf + ' SET ';
	for(var c in counters){
		console.log(c, counters[c])
		cql += c + ' = ' + c + ' + ' + counters[c] + ',';
		//data.push(counters[c]);
	}
	cql = cql.substring(0, cql.length - 1);
	cql += ' WHERE KEY = ?;';
	data.push(getTextDate(new Date()));

	//console.log(cql,data)
	pool.cql(cql, data, function(err, results){
	    if(err){
	      //TODO Log error
	      console.log(err);
	      return;
	    }          
	    if(callback && typeof(callback) == 'function')
	    	callback(err, res);
	});
}

/** Processor function **/

function insertRequest(msg, callback){
	insertLog(msg, 'request_log', callback);
}

function insertError(msg, callback){
	insertLog(msg, 'error_log', callback);
}

function insertEvent(msg, callback){
	console.log(msg)
	insertCounters(msg, 'stat_counter', callback);
}

//TODO put it into utils

function getTextDate(date){
    var day = '' + date.getFullYear();
    day += (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    day += (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    return day;
}