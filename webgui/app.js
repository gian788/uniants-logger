
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var refreshRate = 500; //ms

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
    //res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE, OPTIONS');
    //res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    //res.header('Access-Control-Allow-Origin', "*")
  next()
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res)
{
    res.render('index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var RedisStore  = require('connect-redis')(express);
var cookieParser = express.cookieParser()
  , sessionStore = new RedisStore({
        host: 'localhost',
        port: 6379,
        db: 3
    });

var server = http.createServer(function(){}).listen(3002)
  , io = require('socket.io').listen(server);

io.set('log level', 1)
io.set('heartbeat', true)

/*var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);*/


//sessionSockets.on('connection', function (err, socket, session) {
io.sockets.on('connection', function(socket){
  var request = require('./controllers/request')
  var start = new Date(),
      end;
  start.setHours(0);
  start.setMinutes(0);
    setInterval(function(){
        end = new Date();
        request.getRequestLog(start, end, function(err, res){
            if(res && res.length > 0)
                socket.emit('req', res);
            start = end;
        });     
    }, refreshRate);
  
    socket.on('requestLog', function (data) {
        console.log('requestLog.data', data);
        if(!data){
            console.log('getRequestLog')
            return request.getRequestLog(new Date(1970,1,1), new Date(), function(err, res){
                socket.emit('req', res);
            })
          }
        if(data.start && data.end)
            request.getRequestLog(new Date(data.start), new Date(data.end), function(err, res){
                socket.emit('req', res);
                console.log(res.length)
            })
        else
            request.getRequestLog(new Date(data.start), function(err, res){
                socket.emit('req', res);
            })
    });
});
