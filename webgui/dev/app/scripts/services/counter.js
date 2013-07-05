'use strict';

angular.module('devApp')
	.service('counter', function counter() {
	    var counter = {}
	    var minDay,
	    	maxDay
	    var pollInterval = 2000 //ms

	    var socket = io.connect('http://127.0.0.1:3002',
		    {
		        'sync disconnect on unload': false
		    });
		    
	    socket.on('counter', function (data) {
	      if(data){
	        for(var day in data){
	        	counter[day] = data[day];
	        	if(day > maxDay)
	        		maxDay = day
	        	if(day < minDay)
	        		minDay = day
	        }
	        $rootScope.$apply()
	      }
	      //console.log(requestes)
	    })

	    setInterval(function(){
	      if(!maxDay)
	        getLastFromSource()
	      else
	        getNextFromSource()
	    }, pollInterval)

	    var getLastFromSource = function(){
	      socket.emit('counter:getLast', {replyCh: 'req'})      
	    }

	    var getNextFromSource = function(){
	      if(!maxDay)
	        maxDay = new Date()      
	      socket.emit('counter:getNext', {replyCh: 'req', ts: maxDay})
	    }

	    var getPrevFromSource = function(){  
	      if(!minDay)  
	        minDay = new Date();  
	      socket.emit('counter:getPrev', {replyCh: 'req', ts: minDay})
	    }

	    var getRangeFromSource = function(start, end){
	      socket.emit('counter:getRange', {replyCh: 'req', start: start, end: end})
	    }

	    return {
	    	get: function(){
	    		return counter
	    	},

	    	getNextFromSource: getNextFromSource,
	      	getPrevFromSource: getPrevFromSource,
	      	getRangeFromSource: getRangeFromSource,

	      	setPollInterval: function(interval){
	        	pollInterval = interval
	        	//TODO reset interval
	      	},

	      	getPollInterval: function(){
	        	return pollInterval
	      	}
	    }

	});