
var logger = require('../services/common.js').logger;
var Client = require('ssh2').Client;

/**
 * ssh client to exec cmd on remote server
 * 
 * PARAMS
 * @param loginInfo {
        host: '192.168.3.10',
        port: 22,
        username: 'gushenxing',
        password: 'gushenxing123'
 *  };
 * @param cmd "ls -l"
 * @param callback (err,data,ereData){}
 * 
 */
exports.remoteExec = function (loginInfo, cmd, callback) {

    var conn = new Client();
    try{
        conn.on('ready', function () {
            let result = '';
            let errResult = '';
            conn.exec(cmd, function (err, stream) {
                logger.info("\nexec cmd:-----------------------------------\n", cmd, "\n-----------------------------------------end");
                if (err) {
                    callback(err);
                    return;
                }
                stream.on('close', function (code, signal) {
    
                    //logger.info(result);
                    if (result !== '') {
                        callback(null, result);
                        return;
                    }
    
    
                    if (errResult != '') {
                        //callback(null, null, errResult);
                        return;
                    }
    
                    conn.end();
    
                }).on('data', function (data) {
    
                    if (result == '') result = data.toString() + '\n';
                    else result = result + '\n' + data.toString();
                }).stderr.on('data', function (data) {
                    result = result + "\n" + data;
                    conn.end();
                    return;
                });
            });
        }).connect(loginInfo);
    }catch(err){
        callback(err);
    }
   
}

exports.remoteShell = function (loginInfo, cmd, callback) {
    var conn = new Client();
    conn.on('ready', function () {
        console.log('Client :: ready');
        conn.shell(function (err, stream) {
            if (err) throw err;
            stream.on('close', function () {
                console.log('Stream :: close');
                conn.end();
            }).on('data', function (data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function (data) {
                console.log('STDERR: ' + data);
            });
            stream.write('sudo uname -a');
            stream.end('ls -l\nexit\n');
        });
    }).connect(loginInfo);
}


