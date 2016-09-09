'use strict';

angular.module('devApp')
  .directive('error', ['$compile', function ($compile) {
    return {
      templateUrl: '/views/error.html',
      restrict: 'A',
      scope: {
      		err:'=errSource'
      },
      link: function postLink(scope, element, attrs) {
      	scope.open = false;
      	scope.toggle = function(){
      		scope.open = !scope.open
      		if(scope.open)
      			element.append($compile('<div ng-include="\'/views/errorDetails.html\'"></div>')(scope.$new()))
      		else
      			element.children()[element.children().length-1].remove();
      	}
      }
    };
  }]);