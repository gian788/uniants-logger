'use strict';

describe('Directive: detail', function () {
  beforeEach(module('devApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<detail></detail>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the detail directive');
  }));
});
