function RequestLogCtrl($scope){
  $scope.request = [
    /*{statusCode:200, url:'/user',new:true},
    {statusCode:200, url:'/user',new:false},
    {statusCode:400, url:'/class',new:false}*/
  ]

  $scope.new = function(){
    var count = 0
    angular.forEach($scope.request, function(req){
      count += req.new ? 1 : 0
    })
    return count
  }

  $(document).ready(function(){
    var socket = io.connect('http://localhost:3002');

    socket.on('req', function (data) {

      console.log(data);
      if(data){
        console.log(data.length)
        //requestLog.push(data[0]);
        var i = 0
        angular.forEach(data, function(req){
          var r = JSON.parse(JSON.parse(req.value))
          r.timestamp = new Date(req.ts)
          r.new = true
          console.log(++i, r)

          $scope.request.push(r)
        })
        $scope.$apply()
      }
    });

    setTimeout(function(){
      if($scope.request.length == 0){
        socket.emit('requestLog')
      }
    },1000)
  })

}