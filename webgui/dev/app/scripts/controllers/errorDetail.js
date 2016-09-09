'use strict';

angular.module('devApp')
  .controller('ErrorDetailCtrl', function ($scope) {
    $scope.err = $scope.detail
    $scope.detailType = typeof($scope.err) 
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
