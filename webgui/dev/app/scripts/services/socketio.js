'use strict';

angular.module('devApp')
  .service('socketio', function socketio() {
    var self = this;
  	var serverAddress = 'http://127.0.0.1:3002';
    //var serverAddress = 'http://192.168.0.15:3002';

    console.log(self.socket)
    self.socket = io.connect(serverAddress);
    
    console.log('connecting')
    self.socket.on('connect', function () {
      console.log('connected', arguments)
    })
    self.socket.on('reconnect', function () {
      console.log('reconnected', arguments)
    })
    self.socket.on('disconnect', function () {
      console.log('connect')
      console.log(arguments)
    })
    self.socket.on('connect_failed', function () {
      console.log('connect failed', arguments)
    })
    self.socket.on('error', function (err) {
      console.log('socket error', err,arguments)
      self.socket = io.connect(serverAddress);
    })
    self.socket.on('reconnect_failed', function () {
      console.log('connect failed', arguments)
    })

    self.emit = function(channel, data){
    	self.socket.emit(channel, data);
    }

    self.on = function(channel, fn){
    	self.socket.on(channel, fn);
    }
  });
