'use strict';

angular.module('devApp')
  	.controller('CounterCtrl', function ($scope, counter) {
    	$scope.counter = counter.get();
	    $scope.$watch(function(){
	    	return counter.get()
	    }, function(value){
	    	$scope.counter = value;
	    },true)
  	});