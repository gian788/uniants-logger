var log = require('../lib/db/log.js');

var logCF = 'error_log',
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