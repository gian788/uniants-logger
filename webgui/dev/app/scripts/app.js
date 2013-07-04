'use strict';

angular.module('devApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/request', {
        templateUrl: 'views/requestes.html',
        controller: 'RequestCtrl'
      })      
      .otherwise({
        redirectTo: '/'
      });
  });
