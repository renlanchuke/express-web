
var logger = require('../services/common.js').logger;
var Client = require('ssh2').Client;
var conn = new Client();

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
 */
exports.remoteExec = function (loginInfo, cmd, callback) {
    conn.on('ready', function () {
        let result = '';
        let errResult='';
        conn.exec(cmd, function (err, stream) {
            if (err) throw callback(err);
            stream.on('close', function (code, signal) {
                //console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                callback(null, result)
                conn.end();
            }).on('data', function (data) {
                if (result == '') result = data + '\n';
                else result = result + '\n' + data;
            }).stderr.on('data', function (data) {
                callback(null, null, data.toString());
                stream.destroy();
            });
        });
    }).connect(loginInfo);
}

exports.remoteShell = function (loginInfo, cmd, callback) {
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


