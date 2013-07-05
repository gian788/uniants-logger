'use strict';

angular.module('devApp')
  .factory('request',['$rootScope', function request($rootScope) {
  	var requestes = []
  	var minTimestamp, 
        maxTimestamp
    var pollInterval = 1000 //ms

    var socket = io.connect('http://127.0.0.1:3002',
      {
        'sync disconnect on unload': false
      });
	    
    socket.on('req', function (data) {
      if(data){
        angular.forEach(data, function(req){
          var r = JSON.parse(JSON.parse(req.value))//TODO check why duoble JSON
          r.timestamp = new Date(req.ts)
          if(!minTimestamp || r.timestamp < minTimestamp)
          	minTimestamp = r.timestamp
          if(!maxTimestamp || r.timestamp > maxTimestamp)
            maxTimestamp = r.timestamp
          requestes.push(r)
        })
        $rootScope.$apply()
      }
      //console.log(requestes)
    })

    setInterval(function(){
      if(!maxTimestamp)
        getLastFromSource()
      else
        getNextFromSource()
    }, pollInterval)

    var getLastFromSource = function(){
      socket.emit('request:getLast', {replyCh: 'req'})      
    }

    var getNextFromSource = function(){
      if(!maxTimestamp)
        maxTimestamp = new Date()      
      socket.emit('request:getNext', {replyCh: 'req', ts: maxTimestamp})
    }

    var getPrevFromSource = function(){  
      if(!minTimestamp)  
        minTimestamp = new Date();  
      socket.emit('request:getPrev', {replyCh: 'req', ts: minTimestamp})
    }

    var getRangeFromSource = function(start, end){
      socket.emit('request:getRange', {replyCh: 'req', start: start, end: end})
    }

    return {
    	get: function(){
    		return requestes
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

  }]);
