var pm = require('pm2');
var os = require('os')

exports.get = function(data, callback){
    pm.getMonitorData(function(err, res){
    	console.log(err, res)
    })
    callback(null, 'ok')
}

exports.getSysInfo = function(data, callback){
	var data = {
        system_info: { hostname: os.hostname(),
                       uptime: os.uptime()
                     },
        monit: { loadavg: os.loadavg(),
                 total_mem: os.totalmem(),
                 free_mem: os.freemem(),
                 cpu: os.cpus(),
                 interfaces: os.networkInterfaces()
               },
      };
      callback(null, data)
}

exports.getSysUsage = function(data, callback){
	var data = {
        loadavg: os.loadavg(),
        total_mem: os.totalmem(),
        free_mem: os.freemem(),
      };
    callback(null, data)
}