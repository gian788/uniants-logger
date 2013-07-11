'use strict';

describe('Controller: ErrorDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('devApp'));

  var ErrorDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrorDetailCtrl = $controller('ErrorDetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
