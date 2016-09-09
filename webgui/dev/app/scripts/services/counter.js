'use strict';

angular.module('devApp')
  .factory('counter',['$rootScope', 'socketio', function counter($rootScope, socket) {

  	var serviceFunc = function(resource, replyCh, cb){
  		var self = this;

  		self.minTimestamp
	    self.maxTimestamp
	    self.pollInterval = 1000 //ms

	    self.nextCounter = 0;

	        
	    self.getLastFromSource = function(){
	      socket.emit(resource + ':getLast', {replyCh: replyCh});
	    }

	    self.getNextFromSource = function(){
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
	      	for(var i in data){
	      		var date = new Date(parseInt(i))
	      		if(self.minTimestamp > date || !self.minTimestamp)
	      			self.minTimestamp = date
	      		if(self.maxTimestamp < date || ! self.maxTimestamp)
	      			self.maxTimestamp = date
	      	}
	        return cb(data);
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

