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

var ready = false;


function genericQuery(cql, params, callback){
    pool.connect(function(err, keyspace){
        if(err)
            return callback(err, null)
        //console.log(cql, params)
        pool.cql(cql, params, function(err, results){
            if(err)
                return callback(err, null);
            if(results.length == 0)
                return callback(null, null)

            var res = {};
            results.forEach(function(row){ 
                res['' + row.key] = {};
                row.forEach(function(name,value,ts,ttl){
                    res['' + row.key] = value;
                });
            });
            callback(null, res)   
        }); 
    });
}


function getDailyCounter(start, end, cf, callback){
    if(arguments.length != 5)
        return callback('Error: Wrong number of arguments. 5 required');
    
    var self = this;
    var cql = 'SELECT * FROM ' + cf +' WHERE KEY >= ? AND KEY <= ?;';
    self.params = [    
        getTextDate(start),
        getTextDate(end)
    ];
    genericQuery(cql, self.params, callback);        
}

var getDay = function(day, cf, callback){
    getDailyCounter(new Date(), new Date(), cf, callback);
}

var getLast = function(cf, limit, callback){
    getDailyCounter(new Date(), new Date((new Date).getDay() - limit), cf, callback);
}

var getNext = function(timestamp, cf, limit, callback){
    var date = new Date(timestamp);
    getDailyCounter(date, new Date(dat.getDay() - limit), cf, callback);
}

var getPrev = function(timestamp, cf, limit, callback){
    var date = new Date(timestamp);
    getDailyCounter(new Date(date.getDay() - limit), date, cf, callback);
}

var getRange = function(start, end, cf, callback){
    getDailyCounter(new Date(start), new Date(end), cf, callback);
}

exports.getDay = getDay;
exports.getLast = getLast;
exports.getNext = getNext;
exports.getPrev = getPrev;
exports.getRange = getRange;