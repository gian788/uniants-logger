'use strict';

describe('Directive: request', function () {
  beforeEach(module('devApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<request></request>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the request directive');
  }));
});
