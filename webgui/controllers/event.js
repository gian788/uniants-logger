var counter = require('../lib/db/counter.js');

var counterCF = 'stat_counter',
    limit = 15; //days

exports.getLast = function(data, callback){
    counter.getLast(counterCF, limit, callback);
}

exports.getNext = function(data, callback){
    counter.getNext(data.ts, counterCF, limit, callback);
}

exports.getPrev = function(data, callback){
    counter.getPrev(data.ts, counterCF, limit, callback);
}

exports.getRange = function(data, callback){
    counter.getRange(data.start, data.end, counterCF, limit, callback);
}

