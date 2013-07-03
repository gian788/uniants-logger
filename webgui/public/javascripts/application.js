$(document).ready(function(){
  var socket = io.connect('http://localhost:3002');
  socket.on('req', function (data) {
    console.log(data);
    //socket.emit('my other event', { my: 'data' });
  });
})