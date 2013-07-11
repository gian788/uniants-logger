'use strict';

angular.module('devApp')
  .factory('request',['$rootScope', 'log', function request($rootScope, log) {

  	var requestes = [];
  	
    var dataSource = log.get('request', 'req', function(data){
        angular.forEach(data, function(value){
          requestes.push(value);
        })
        $rootScope.$apply();
      })
      
      return {
        get: function(){
          return requestes;
        },

        getNextFromSource: dataSource.getNextFromSource,
        getPrevFromSource: dataSource.getPrevFromSource,
        getRangeFromSource: dataSource.getRangeFromSource,

        /*setPollInterval: dataSource.setPollInterval,
        getPollInterval: dataSource.getPollInterval*/
      }

  }]);
