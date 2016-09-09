'use strict';

angular.module('devApp')
  	.service('event', ['$rootScope', 'counter', function event($rootScope, counter) {
    	var events = [];

    	var dataSource = counter.get('event', 'cnt', function(data){
    		for(var i in data){
    			var found = false;
    			for(var j in events){
    				if(events[j].timestamp == i){
    					events[j].counter = data[i]
    					found = true;
    				}
    			}
    			if(!found)
    				events.push({
	    				counter: data[i],
	    				timestamp: i
	    			});
    		}
        	$rootScope.$apply();
    	})
    	
	    return {
	    	get: function(){
	    		return events;
	    	},

	    	getNextFromSource: dataSource.getNextFromSource,
		    getPrevFromSource: dataSource.getPrevFromSource,
		    getRangeFromSource: dataSource.getRangeFromSource,

		    /*setPollInterval: dataSource.setPollInterval,
		    getPollInterval: dataSource.getPollInterval*/
	    }
  	}]);
