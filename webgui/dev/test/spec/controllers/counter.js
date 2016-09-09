'use strict';

describe('Controller: CounterCtrl', function () {

  // load the controller's module
  beforeEach(module('devApp'));

  var CounterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CounterCtrl = $controller('CounterCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
