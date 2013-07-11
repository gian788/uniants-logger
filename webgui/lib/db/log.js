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

pool.connect(function(err, keyspace){
    if(err)
        return console.log(err)  
    console.log('connected pool')
});

function genericQuery(cql, params, callback){
    //pool.connect(function(err, keyspace){
        //if(err)
        //    return callback(err, null)        
        //console.log(cql, params)
        pool.cql(cql, params, function(err, results){
            if(err)
                return callback(err, null);
            if(results.length == 0)
                return callback(null, null)

            var res = [];
            results.forEach(function(row){ 
                row.forEach(function(name,value,ts,ttl){
                    res.push({name: name, value: value, ts: ts});
                });
            });
            callback(null, res);  
        }); 
    //});
}

function getLast(cf, limit, callback){    
    if(arguments.length != 3)
        return callback('Error: Wrong number of arguments. 3 required');
    var self = this;
    var cql = 'SELECT FIRST ' + limit + ' ?..? FROM ' + cf +' WHERE KEY = ?;';
    var date = new Date();
    self.params = [    
        helenus.TimeUUID.fromTimestamp(date),
        helenus.TimeUUID.fromTimestamp(getMidnigth(date)),
        getTextDate(date)
    ];
    var results = [];
    var count = 0;
    var recGet = function(){
        //console.log(cql, [date, getMidnigth(date), getTextDate(date)])
        genericQuery(cql, self.params, function(err, res){
            if(err)
                return callback(err, null);
            for(var i in res)
                results.push(res[i]);
            if(results.length < limit && ++count < 90){
                date = new Date(date.setDate(date.getDate() - 1));
                self.params = [
                    helenus.TimeUUID.fromTimestamp(new Date()),
                    helenus.TimeUUID.fromTimestamp(getMidnigth(date)),
                    getTextDate(date)
                ];
                return recGet();
            }        
            return callback(null, results);            
        });    
    }
    recGet(); 
}

function getNext(timestamp, cf, limit, callback){
    if(arguments.length != 4)
        return callback('Error: Wrong number of arguments. 3 required');
    var self = this;
    var cql = 'SELECT FIRST ' + limit + ' ?..? FROM ' + cf +' WHERE KEY = ?;';
    var date = new Date(timestamp);
    self.params = [    
        helenus.TimeUUID.fromTimestamp(new Date()),
        helenus.TimeUUID.fromTimestamp(date),
        getTextDate(new Date())
    ]; 
    //console.log(cql, [new Date(), date, getTextDate(new Date())])
    genericQuery(cql, self.params, function(err, res){
        if(err)
            return callback(err, null);
        return callback(null, res);
    });    
     
}

function getPrev(timestamp, cf, limit, callback){
    if(arguments.length != 4)
        return callback('Error: Wrong number of arguments. 3 required');
    var self = this;
    var cql = 'SELECT FIRST ' + limit + ' ?..? FROM ' + cf +' WHERE KEY = ?;';
    var date = new Date(timestamp);
    self.params = [    
        helenus.TimeUUID.fromTimestamp(date),
        helenus.TimeUUID.fromTimestamp(new Date(1970,1,1)),
        getTextDate(date)
    ];
    var results = [];
    var count = 0;
    var recGet = function(){
        //console.log(cql, [date, new Date(1970,1,1), getTextDate(date)])
        genericQuery(cql, self.params, function(err, res){
            if(err)
                return callback(err, null);
            for(var i in res)
                results.push(res[i]);

            if(results.length < limit && ++count < 90){
                date = new Date(date.setDate(date.getDate() - 1));
                self.params = [    
                    helenus.TimeUUID.fromTimestamp(new Date(timestamp)),
                    helenus.TimeUUID.fromTimestamp(new Date(1970,1,1)),
                    getTextDate(date)
                ];
                return recGet();
            }
            //TODO fix loop problem when go to the last row            
            return callback(null, results);            
        });    
    }
    recGet();
}

function getRange(start, end, cf, limit, callback){
    if(arguments.length != 3)
        return callback('Error: Wrong number of arguments. 3 required');
    var self = this;
    var cql = 'SELECT FIRST ' + limit + ' ?..? FROM ' + cf +' WHERE KEY = ?;';
    var date = new Date(start);
    self.params = [    
        helenus.TimeUUID.fromTimestamp(end),
        helenus.TimeUUID.fromTimestamp(start),
        getTextDate(start)
    ];
    var results = [];
    var recGet = function(){
        //console.log(cql, [date, getMidnigth(date), getTextDate(date)])
        genericQuery(cql, self.params, function(err, res){
            if(err)
                return callback(err, null);

            for(var i in res)
                results.push(res[i]);

            if(results.length < limit){
                date = new Date(date.setDate(date.getDate() - 1));
                self.params = [
                    helenus.TimeUUID.fromTimestamp(end),
                    helenus.TimeUUID.fromTimestamp(start),
                    getTextDate(date)
                ];
                return recGet();
            }
            //TODO fix loop problem when go to the last row            
            return callback(null, results);            
        });    
    }
    recGet();
}

function getTextDate(date){
    var day = '' + date.getFullYear();
    day += (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    day += (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    return day;
}

function getMidnigth(date){
    if(typeof(date) != 'object')        
        date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());    
}

exports.getLast = getLast;
exports.getNext = getNext;
exports.getPrev = getPrev;
exports.getRange = getRange;