var redis = require('redis');
	client = redis.createClient();

client.on('error', function(err) {
	console.log('error', err);
})

var N = 10000
	client.select(3, function(err, res){
		if(err){
			console.log(err);
			return;
		}
		var t = (new Date()).getTime()
		for(var i = 0; i < N; i++)
			client.rpush('test', 'log' + i)
		console.log((new Date()).getTime() - t)
		process.exit()
		
	});
 