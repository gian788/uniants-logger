'use strict';

angular.module('devApp')
  .controller('RequestCtrl', function ($scope, request) {
    $scope.request = request.get();
    $scope.$watch(function(){
    	return request.get()
    }, function(value){
    	$scope.request = value;
    },true)

    $scope.filteredRequestes = [];

    $scope.$watch('filteredRequestes',function(data){
    	if($scope.filteredRequestes.length==0 && $scope.request.length!=0){
    		request.getFromSource();
    		console.log('filteredRequestes')
    	}
    },true)

    $scope.$watch('request',function(data){
    	console.log($scope.filteredRequestes.length, $scope.request.length)
    	if($scope.filteredRequestes.length==0 && $scope.request.length!=0){
    		request.getFromSource();
    		console.log('request')
    	}
    },true)

   	$scope.new = function(){
    	var count = 0
    	angular.forEach($scope.request, function(req){
      		count += req.new ? 1 : 0
    	})
    	return count
  	}

	 
  });

