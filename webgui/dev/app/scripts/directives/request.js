'use strict';

angular.module('devApp')
  .directive('request', ['$compile',function ($compile) {
    return {
      templateUrl: '/views/request.html',
      restrict: 'A',
      scope: {
      		req:'=reqSource'
      },
      link: function postLink(scope, element, attrs) {
      	scope.open = false;
      	scope.toggle = function(){
      		scope.open = !scope.open
      		if(scope.open)
      			element.append($compile('<div ng-include="\'/views/requestDetails.html\'"></div>')(scope.$new()))
      		else
      			element.children()[element.children().length-1].remove();
      	}
      }
    };
  }]);