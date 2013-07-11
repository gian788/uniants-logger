'use strict';

describe('Directive: error', function () {
  beforeEach(module('devApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<error></error>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the error directive');
  }));
});
