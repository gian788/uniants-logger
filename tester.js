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
    getLog('20130703', function(err, res){

        pool.close();
        process.exit()
    })

})



var getLog = function(day, callback){
    var cql = '';
    var params = []
    //cql = "SELECT * FROM log WHERE url = '/user';"
    var t = (new Date()).getTime()
    cql = "SELECT FIRST 30 ?..? FROM test WHERE KEY = ?;"
    params = [helenus.TimeUUID.fromTimestamp(new Date(1970,1,1)), helenus.TimeUUID.fromTimestamp(new Date()), day]
    //cql = "INSERT INTO test (KEY, ?) VALUES (?, ?)"
    //params = [helenus.TimeUUID.fromTimestamp(new Date()), '20130701', '{"a":1,"b":"c"}'];
    console.log(cql)
    console.log(params)
    console.log()
    pool.cql(cql, params, function(err, results){
        if(err){
          //TODO Log error
          console.log(err);
          //return;
        }
        /*for(var i in results){
            if(results[i].key > t)
                console.log('>')
            else
                console.log('<')
        }*/
        console.log(results)
        console.log()

        results.forEach(function(row){
          //gets the 5th column of each row
          //console.log(row);
          row.forEach(function(name,value,ts,ttl){
            //all column of row
            console.log(name,value,ts,ttl);
            console.log()
          });
          
          
        });

        callback(null, results)
    }); 
}


/*
1372769308134
1372769129778
1372774864843
*/