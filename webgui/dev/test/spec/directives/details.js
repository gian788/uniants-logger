'use strict';

describe('Directive: details', function () {
  beforeEach(module('devApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<details></details>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the details directive');
  }));
});
