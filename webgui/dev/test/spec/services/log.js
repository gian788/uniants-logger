'use strict';

describe('Service: log', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var log;
  beforeEach(inject(function (_log_) {
    log = _log_;
  }));

  it('should do something', function () {
    expect(!!log).toBe(true);
  });

});
