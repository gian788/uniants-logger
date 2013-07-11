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
      .when('/error', {
        templateUrl: 'views/errors.html',
        controller: 'ErrorCtrl'
      })
      .when('/event', {
        templateUrl: 'views/event.html',
        controller: 'EventCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
