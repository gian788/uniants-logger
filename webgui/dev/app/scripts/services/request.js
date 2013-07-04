'use strict';

angular.module('devApp')
  .factory('request',['$rootScope', function request($rootScope) {
  	var requestes = []
  	var minTimestamp = new Date()
    var socket = io.connect('http://127.0.0.1:3002');
	    
    socket.on('req', function (data) {
      if(data){
        var i = 0
        angular.forEach(data, function(req){
          var r = JSON.parse(JSON.parse(req.value))
          r.timestamp = new Date(req.ts)
          if(r.timestamp < minTimestamp)
          	minTimestamp = r.timestamp
          r.new = true
          requestes.push(r)
        })
        $rootScope.$apply()
      }
      console.log(requestes)
    });

    setTimeout(function(){
      if(requestes.length == 0){
        socket.emit('requestLog')
      }
    },1500)


    return {
    	get: function(){
    		return requestes;
    	},
    	getFromSource: function(){
    		socket.emit('requestLog', {end: minTimestamp, start: (new Date(1970,1,1)).getTime()}, new Date(1970,1,1))
    	}
    }

  }]);
