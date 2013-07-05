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

            var res = [];
            results.forEach(function(row){ 
                row.forEach(function(name,value,ts,ttl){
                    res.push({name: name, value: value, ts: ts});
                });
            });
            callback(null, res)   
        }); 
    });
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
                    helenus.TimeUUID.fromTimestamp(new Date()),
                    helenus.TimeUUID.fromTimestamp(getMidnigth(date)),
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

function getNext(timestamp, cf, limit, callback){
    if(arguments.length != 4)
        return callback('Error: Wrong number of arguments. 3 required');
    var self = this;
    var cql = 'SELECT FIRST ' + limit + ' ?..? FROM ' + cf +' WHERE KEY = ?;';
    var date = new Date(timestamp);
    self.params = [    
        helenus.TimeUUID.fromTimestamp(new Date()),
        helenus.TimeUUID.fromTimestamp(date),
        getTextDate(date)
    ]; 
    //console.log(cql, [new Date(), getMidnigth(date), getTextDate(date)])
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
    var recGet = function(){
        console.log(cql, [date, new Date(1970,1,1), getTextDate(date)])
        genericQuery(cql, self.params, function(err, res){
            if(err)
                return callback(err, null);

            for(var i in res)
                results.push(res[i]);

            if(results.length < limit){
                date = new Date(date.setDate(date.getDate() - 1));
                console.log(self.params)
               self.params = [    
                     helenus.TimeUUID.fromTimestamp(new Date(timestamp)),
                    helenus.TimeUUID.fromTimestamp(new Date(1970,1,1)),
                    getTextDate(date)
                ];
                console.log(self.params)
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
    var date = new Date(timestamp);
    self.params = [    
        helenus.TimeUUID.fromTimestamp(end),
        helenus.TimeUUID.fromTimestamp(start),
        getTextDate(end)
    ];
    var results = [];
    var recGet = function(){
        genericQuery(cql, self.params, function(err, res){
            if(err)
                return callback(err, null);
            if(results.length + res.length < limit){
                if(results.length == 0)
                    results = res;
                end = getMidnigth(new Date(end.setDate(end.getDate() - 1)));
                if(end < start){
                    if(results.length == 0)
                        return callback(null, res);    
                    for(var i in res)
                        results.push(res[i]);
                    return callback(null, results);
                }
                self.params = [
                    helenus.TimeUUID.fromTimestamp(end),
                    helenus.TimeUUID.fromTimestamp(start),
                    getTextDate(end)
                ];
                recGet();
            }else{
                if(results.length == 0)
                    return callback(null, res);    
                for(var i in res)
                    results.push(res[i]);
                return callback(null, results);
            }
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



exports.getLast = function(data, callback){
    getLast('test', 20, callback);
}

exports.getNext = function(data, callback){
    getNext(data.ts, 'test', 20, callback);
}

exports.getPrev = function(data, callback){
    getPrev(data.ts, 'test', 20, callback);
}

exports.getRange = function(data, callback){
    getRange(data.start, data.end, 'test', 20, callback);
}



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
