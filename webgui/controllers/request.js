var log = require('../lib/db/log.js');

var logCF = 'request_log',
    limit = 20; //request

exports.getLast = function(data, callback){
    log.getLast(logCF, limit, callback);
}

exports.getNext = function(data, callback){
    log.getNext(data.ts, logCF, limit, callback);
}

exports.getPrev = function(data, callback){
    log.getPrev(data.ts, logCF, limit, callback);
}

exports.getRange = function(data, callback){
    log.getRange(data.start, data.end, logCF, limit, callback);
}



/*
create column family request_log
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


  create column family request_log
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


create column family error_log
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
 
  */
