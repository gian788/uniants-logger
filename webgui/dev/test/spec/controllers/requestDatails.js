'use strict';

describe('Controller: RequestDatailsCtrl', function () {

  // load the controller's module
  beforeEach(module('devApp'));

  var RequestDatailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RequestDatailsCtrl = $controller('RequestDatailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
