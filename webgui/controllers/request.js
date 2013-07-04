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



var startTimestamp,
    endTimestamp;

var getRequestLog = function(start, end, callback){
    switch(arguments.length){
        case 1:            
            callback = start;
            start = undefined;
        break;
        case 2:
            callback = end;
            end = undefined;
        break;
    }

    var day = getTextDate(start);

    var cql = 'SELECT FIRST 20 ?..? FROM test WHERE KEY >= ?;';
    var params = [];  

    //console.log(day, end, start)

    if(start)
        if(end)
            params = [helenus.TimeUUID.fromTimestamp(end), helenus.TimeUUID.fromTimestamp(start), parseInt(day)]
        else
            params = [helenus.TimeUUID.fromTimestamp(new Date()), helenus.TimeUUID.fromTimestamp(start), parseInt(day)]
    
    pool.connect(function(err, keyspace){
      if(err)
          return console.log(err)
      pool.cql(cql, params, function(err, results){
        if(err){
            console.log(err)
            return callback(err, null);
        }
        //console.log(results)
        if(results.length == 0)
            return callback(null, null)

        var res = [];
        var x = 0
        results.forEach(function(row){ 
            console.log(++x, row.length)
            if(row.length == 0)
                return callback(null, null);          
            if(row[row.length - 1].timestamp == startTimestamp)
                return callback(null, null);            
            startTimestamp = row[0].timestamp;
            row.forEach(function(name,value,ts,ttl){
                res.push({name: name, value: value, ts: ts})
            });
        });
        callback(null, res)   
     }); 
    })
    
}

var getErrorLog = function(){

}

var getEventLog = function(){
    switch(arguments.length){
        case 1:            
            callback = start;
            start = undefined;
        break;
        case 2:
            callback = end;
            end = undefined;
        break;
    }    
    
    var cql = 'SELECT * FROM test ';
    var params = [];  

    if(start){
        cql = 'WHERE KEY > ?';
        params.push(getTextDate(start))
        if(end){
            cql += ' AND KEY < ?;';   
            params.push(getTextDate(end));
        }
    }else{
        cql = 'WHERE KEY = ?;';
        params.push(getTextDate(new Date()));
    }

    //console.log(day, end, start)

    if(start)
        if(end)
            params = [helenus.TimeUUID.fromTimestamp(end), helenus.TimeUUID.fromTimestamp(start), day]
        else
            params = [helenus.TimeUUID.fromTimestamp(new Date()), helenus.TimeUUID.fromTimestamp(start), day]
    else
        if(startTimestamp)
            params = [helenus.TimeUUID.fromTimestamp(new Date()), helenus.TimeUUID.fromTimestamp(startTimestamp), day]
        else
            params = [helenus.TimeUUID.fromTimestamp(new Date()), helenus.TimeUUID.fromTimestamp(new Date(1970,1,1)), day]
    
    pool.cql(cql, params, function(err, results){
        if(err){
            console.log(err)
            return callback(err, null);
        }
        //console.log(results)
        if(results.length == 0)
            return callback(null, null)
        results.forEach(function(row){ 
            if(row.length == 0)
                return callback(null, null);          
            if(row[row.length - 1].timestamp == startTimestamp)
                return callback(null, null);            
            startTimestamp = row[0].timestamp;
            callback(null, results)          
        });
    }); 
};

function getTextDate(date){
    var day = '' + date.getFullYear();
    day += (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    day += (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    return day;
}

exports.getRequestLog = getRequestLog;
exports.getErrorLog = getErrorLog;
exports.getEventLog = getEventLog;

/*
create column family test
  with column_type = 'Standard'
  and comparator = 'ReversedType(org.apache.cassandra.db.marshal.TimeUUIDType)'
  and default_validation_class = 'UTF8Type'
  and key_validation_class = 'IntegerType'
  and read_repair_chance = 1
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'KEYS_ONLY'
  and compression_options = {'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};


  create column family test
  with column_type = 'Standard'
  and comparator = 'ReversedType(TimeUUIDType)'
  and default_validation_class = 'UTF8Type'
  and key_validation_class = 'IntegerType'
  and read_repair_chance = 1.0
  and dclocal_read_repair_chance = 0.0
  and gc_grace = 864000
  and min_compaction_threshold = 4
  and max_compaction_threshold = 32
  and replicate_on_write = true
  and compaction_strategy = 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy'
  and caching = 'NONE'
  and bloom_filter_fp_chance = 0.001
  and compaction_strategy_options = {'min_sstable_size' : '52428800'}
  and compression_options = {'chunk_length_kb' : '64', 'sstable_compression' : 'org.apache.cassandra.io.compress.SnappyCompressor'};

  */
