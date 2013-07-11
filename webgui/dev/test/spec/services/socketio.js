'use strict';

describe('Service: socketio', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var socketio;
  beforeEach(inject(function (_socketio_) {
    socketio = _socketio_;
  }));

  it('should do something', function () {
    expect(!!socketio).toBe(true);
  });

});
