'use strict';

angular.module('devApp')
  .controller('RequestDetailCtrl', function ($scope) {
    $scope.req = $scope.detail
    $scope.detailType = typeof($scope.req) 
    $scope.open = false;
    $scope.toggle = function(){
    	$scope.open = !$scope.open
    }
    $scope.count = function(){
    	var i = 0
    	angular.forEach($scope.detail, function(det){
    		i++
    	})
    	return i
    }
  });
