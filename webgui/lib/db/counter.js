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
    
        //console.log(cql, params)
        pool.cql(cql, params, function(err, results){
            if(err)
                return callback(err, []);
            if(results.length == 0)
                return callback(null, [])
            var des = new helenus.Marshal('IntegerType');
            var res = {};
            //console.log(results)
            results.forEach(function(row){ 
                //console.log(row)
                //if(row.count <= 0)
                  //  return;                
                var key = '' + getDateFromText('' + des.deserialize(row.key)).getTime()
                res[key] = {};
                row.forEach(function(name,value,ts,ttl){ 
                    res['' + key][name] = value;
                });
            });
            //console.log(res);
            callback(null, res)   
        }); 
    
}

function getDailyCounter(start, end, cf, callback){
    if(arguments.length != 4)
        return callback('Error: Wrong number of arguments. 4 required');
    
    var self = this;

    var keys = '';
    var days = (end.getTime() - start.getTime()) / (24 * 3600 * 1000);
    days = Math.floor(days)
    console.log(days)
    
    for(var i = 0; i < days + 1; i++)
        keys += getTextDate((new Date(start)).setDate(start.getDate() + i)) + ',';
    keys = keys.substring(0, keys.length - 1);

    //var cql = "SELECT * FROM " + cf + " WHERE KEY >= " + getTextDate(start) + " AND KEY < " + getTextDate(end) + ";";    
    var cql = "SELECT * FROM " + cf + " WHERE KEY IN (" + keys + ");";    
    self.params = [    
       // getTextDate(start),
       // getTextDate(end)
    ];
    genericQuery(cql, self.params, callback);        
}

var getDay = function(day, cf, callback){
    getDailyCounter(new Date(), new Date(), cf, callback);
}

var getLast = function(cf, limit, callback){
    var startDate = new Date((new Date()).setDate((new Date()).getDate() - (limit - 1 )))
    getDailyCounter(startDate, new Date(), cf, callback);
}

var getNext = function(timestamp, cf, limit, callback){
    var date = new Date(timestamp);
    getDailyCounter(date, date, cf, callback);
}

var getPrev = function(timestamp, cf, limit, callback){
    var date = new Date(timestamp);
    getDailyCounter(new Date(date.getDay() - limit), date, cf, callback);
}

var getRange = function(start, end, cf, callback){
    getDailyCounter(new Date(start), new Date(end), cf, callback);
}

function getDateFromText(text){
    return new Date(
        text.substr(0,4),
        text.substr(4, 2) - 1,
        text.substr(6,2)
    );
}

function getTextDate(date){
    if(typeof(date) != 'object')
        date = new Date(date);
    var day = '' + date.getFullYear();
    day += (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    day += (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    return day;
}


exports.getDay = getDay;
exports.getLast = getLast;
exports.getNext = getNext;
exports.getPrev = getPrev;
exports.getRange = getRange;