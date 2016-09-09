'use strict';

angular.module('devApp')
  .factory('monitor',['$rootScope', 'socketio', function monitor($rootScope, socket) {
  
  	var sysInfo = {},
  		sysUsage = [];
  	var monitor = [];
  	var resource = 'monitor'
	
    socket.on('sysInfo', function (data) {
      	if(data){
      		sysInfo = data;
      	}
    })

    socket.on('sysUsage', function (data) {
	      if(data){
	      	data.timestamp = (new Date()).getTime();
	      	sysUsage.push(data);
	      	$rootScope.$apply();
	      }
	    })

	socket.emit(resource + ':getSysInfo', {replyCh: 'sysInfo'});

	setInterval(function(){
	      socket.emit(resource + ':getSysUsage', {replyCh: 'sysUsage'});
	    }, 1000);

    return {
    	getSysInfo: function(){
    		return sysInfo;
    	},
    	getSysUsage: function(){
    		return sysUsage;
    	},
    	get: function(){
    		return monitor;
    	},
    }

  }]);

