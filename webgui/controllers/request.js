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

pool.connect(function(err, keyspace){
    /*pool.cql("SELECT * FROM log WHERE url = '/user';", [], function(err, results){
        if(err){
          //TODO Log error
          console.log(err);
          //return;
        }
        console.log(results)
        pool.close();
    });   */ 

})
/*var t;
var get = function(callback){
    console.log(1,t)
    var cql = "SELECT * FROM log"
    if (!t) {
        cql += ";";        
    }else{
        cql += " WHERE KEY > " + t + ";"
    }
    t = (new Date()).getTime();

     pool.cql(cql, [], function(err, results){
        if(err){
          //TODO Log error
          console.log(err);
          //return;
        }
        //console.log(results)
        //console.log(2,t)
        //pool.close();
        callback(null, results)
    }); 
}*/
var startTimestamp;
var getLog = function(callback){
    day='20130703' 
    var cql = '';
    var params = []
    //cql = "SELECT * FROM log WHERE url = '/user';"
    var t = (new Date()).getTime()
    cql = "SELECT FIRST 30 REVERSED ?..? FROM test WHERE KEY = ?;"
    console.log('startTimestamp: ', startTimestamp)
    if(startTimestamp)
        params = [helenus.TimeUUID.fromTimestamp(new Date()), startTimestamp, day]
    else
        params = [helenus.TimeUUID.fromTimestamp(new Date()), helenus.TimeUUID.fromTimestamp(new Date(1970,1,1)), day]
    //cql = "INSERT INTO test (KEY, ?) VALUES (?, ?)"
    //params = [helenus.TimeUUID.fromTimestamp(new Date()), '20130701', '{"a":1,"b":"c"}'];
    console.log(cql)
    console.log(params)
    console.log()
    pool.cql(cql, params, function(err, results){
        if(err){
            console.log(err)
            return callback(err, null);
        }

        /*for(var i in results){
            if(results[i].key > t)
                console.log('>')
            else
                console.log('<')
        }*/
        //console.log(results)
        console.log()

        results.forEach(function(row){
            startTimestamp = row[row.length-1].name;
            console.log(0, row[0].timestamp)
            console.log(row.length-1, row[row.length-1].timestamp)
            console.log(row.length)
          //gets the 5th column of each row
          //console.log(row);
          /*row.forEach(function(name,value,ts,ttl){
            //all column of row
            console.log(name,value,ts,ttl);
            console.log()
          });*/
          
          
        });

        callback(null, results)
    }); 
}



exports.get = getLog;