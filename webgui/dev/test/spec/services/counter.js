'use strict';

describe('Service: counter', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var counter;
  beforeEach(inject(function (_counter_) {
    counter = _counter_;
  }));

  it('should do something', function () {
    expect(!!counter).toBe(true);
  });

});
