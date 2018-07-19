
var logger = require('../services/common.js').logger;
var Client = require('ssh2').Client;
var conn = new Client();

/**
 * ssh client to exec cmd on remote server
 * 
 * PARAMS
 * loginInfo {
        host: '192.168.3.10',
        port: 22,
        username: 'gushenxing',
        password: 'gushenxing123'
 *  };
 * cmd "ls -l"
 * callback (err,data,ereData){}
 */
exports.remoteExec=function(loginInfo,cmd,callback){
    conn.on('ready', function() {
        conn.exec(cmd, function(err, stream) {
          if (err) throw callback(err);
          stream.on('close', function(code, signal) {
            //console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
          }).on('data', function(data) {
            callback(null,data)
          }).stderr.on('data', function(data) {
              callback(null,null,data);
            stream.destroy();
          });
        });
      }).connect(loginInfo);
}
