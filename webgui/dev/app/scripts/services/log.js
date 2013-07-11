'use strict';

angular.module('devApp')
  .factory('log',['$rootScope', 'socketio', function log($rootScope, socket) {

  	var serviceFunc = function(resource, replyCh, cb){
  		var self = this;

  		self.minTimestamp
	    self.maxTimestamp
	    self.pollInterval = 3000 //ms

	    self.nextCounter = 0;

	        
	    self.getLastFromSource = function(){
	      //console.log('getLast',resource + ':getLast', {replyCh: replyCh})
	      socket.emit(resource + ':getLast', {replyCh: replyCh});
	    }

	    self.getNextFromSource = function(){
	      //console.log('getNext'+ ':getNext', {replyCh: replyCh, ts:  self.maxTimestamp})
	      if(!self.maxTimestamp)
	        self.maxTimestamp = new Date();
	      socket.emit(resource + ':getNext', {replyCh: replyCh, ts:  self.maxTimestamp, id: self.nextCounter++});
	    }

	    self.getPrevFromSource = function(){  
	      if(!self.minTimestamp)  
	        self.minTimestamp = new Date();  
	      socket.emit(resource + ':getPrev', {replyCh: replyCh, ts:  self.minTimestamp});
	    }

	    self.getRangeFromSource = function(start, end){
	      socket.emit(resource + ':getRange', {replyCh: replyCh, start: start, end: end});
	    }	
	    
    	socket.on(replyCh, function (data) {
	      if(data){
	      	var logs = [];
	        angular.forEach(data, function(l){
	        	if(l.value == 'NULL')
	        		return;
	        	
	          var log = JSON.parse(l.value)
	          //console.log(log)
	          log.timestamp = new Date(l.ts)
	          if(! self.minTimestamp || log.timestamp <  self.minTimestamp)
	          	 self.minTimestamp = log.timestamp
	          if(! self.maxTimestamp || log.timestamp >  self.maxTimestamp)
	             self.maxTimestamp = log.timestamp
	          logs.push(log)
	        })
	      	//console.log(logs)
	        return cb(logs)
	      }
	    })

	    setInterval(function(){
	      if(!self.maxTimestamp)
	        self.getLastFromSource()
	      else
	        self.getNextFromSource()
	    }, self.pollInterval);		

	    return {
	    	getNextFromSource: self.getNextFromSource,
		    getPrevFromSource: self.getPrevFromSource,
		    getRangeFromSource: self.getRangeFromSource,
	    }
	    
  	}

    return {
    	get: function(resource,replyCh,cb){
    		return new serviceFunc(resource,replyCh,cb)
    	}
    }

  }]);

