'use strict';

angular.module('devApp')
  .controller('MonitorCtrl', function ($scope, monitor) {
    $scope.monitor = monitor.get();
    $scope.sysUsage = monitor.getSysUsage();
    $scope.sysInfo = monitor.getSysInfo();

    $scope.sysUsageLast = function(){
    	return $scope.sysUsage[$scope.sysUsage.length - 1];
    }
  });
