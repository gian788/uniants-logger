'use strict';

angular.module('devApp')
  .controller('RequestDetailCtrl', function ($scope) {
    $scope.req = $scope.detail
    $scope.detailType = typeof($scope.req) 
    $scope.open = false;
    $scope.toggle = function(){
    	$scope.open = !$scope.open
    }
  });
