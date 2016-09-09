'use strict';

angular.module('devApp')
  .controller('EventCtrl', function ($scope, event) {
    $scope.event = event.get();
    $scope.eventType = [];

    $scope.count = function(){
        var count = 0;
        for(var i in $scope.event){
            count++;
        }        
        return count;
    }

        
    $scope.$watch(function(){
    	return event.get()
    }, function(value){
        console.log(value)
        for(var i in value)
            for(var j in value[i].counter)               
                if(!inArray(j, $scope.eventType))
                    $scope.eventType.push(j);        
            
    }, true)

    function inArray(val, arr){
        for(var i in arr)
            if(arr[i] == val)
                return true;
        
        return false;
    }

    /*$scope.filteredRequestes = [];

    $scope.$watch('filteredRequestes',function(data){
    	if($scope.filteredRequestes.length==0 && $scope.event.length!=0){
    		event.getPrevFromSource();
    		console.log('filteredRequestes')
    	}
    },true)

    $scope.$watch('event',function(data){
    	console.log($scope.filteredRequestes.length, $scope.event.length)
    	if($scope.filteredRequestes.length==0 && $scope.event.length!=0){
    		event.getPrevFromSource();
    		console.log('event')
    	}
    },true)  */	

	 
  });

