'use strict';

angular.module('devApp')
  	.service('error', ['$rootScope', 'log', function error($rootScope, log) {
    	var errors = [];

    	var dataSource = log.get('error', 'err', function(data){
    		angular.forEach(data, function(value){
    			errors.push(value);
    		})
        	$rootScope.$apply();
    	})
    	
	    return {
	    	get: function(){
	    		return errors;
	    	},

	    	getNextFromSource: dataSource.getNextFromSource,
		    getPrevFromSource: dataSource.getPrevFromSource,
		    getRangeFromSource: dataSource.getRangeFromSource,

		    /*setPollInterval: dataSource.setPollInterval,
		    getPollInterval: dataSource.getPollInterval*/
	    }
  	}]);
