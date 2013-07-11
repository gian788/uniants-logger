'use strict';

angular.module('devApp')
	.controller('ErrorCtrl', function ($scope, error) {
	 	$scope.error = error.get();

	    $scope.$watch(function(){
	    	return error.get()
	    }, function(value){
	    	$scope.error = value;
	    }, true)

	    /*$scope.filteredErrors = [];

	    $scope.$watch('filteredErrors',function(data){
	    	if($scope.filteredErrors.length==0 && $scope.errors.length!=0){
	    		request.getPrevFromSource();
	    		console.log('filteredErrors')
	    	}
	    },true)

	    $scope.$watch('error',function(data){
	    	console.log($scope.filteredErrors.length, $scope.errors.length)
	    	if($scope.filteredErrors.length==0 && $scope.errors.length!=0){
	    		errors.getPrevFromSource();
	    		console.log('error')
	    	}
	    },true)*/


	});
