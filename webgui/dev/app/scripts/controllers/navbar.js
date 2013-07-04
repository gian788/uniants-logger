'use strict';

angular.module('devApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    //$scope.page = $location.url()
    $scope.location = $location;
    $scope.$watch('location.path()', function(){
    	$scope.page = $location.url()
    })    
  });
