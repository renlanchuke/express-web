// var common=require("../services/common")
// var reqAPI=require('../services/request.js');
// var dateSring=common.getDateString();
// console.log(dateSring);

//reqAPI.getOSDList('http://192.168.3.12:7000');

var shell = require('shelljs');
var logger = require('../services/common.js').logger;

var Client = require('ssh2').Client;

var conn = new Client();
var loginInfo={
    host: '192.168.3.10',
    port: 22,
    username: 'gushenxing',
    password: 'gushenxing123'
};

// function connect(conn) {
//     return promise = new Promise(function (resolve, reject) {
//         conn.on('ready', function () {
//             console.log('Client :: ready');
//             // conn.shell(function (err, stream) {
//             //     if (err) throw err;

//             //     conn.exec('uname -a', function (err, stream) {

//             //     })
//             //     stream.on('close', function () {
//             //         console.log('Stream :: close');
//             //         conn.end();
//             //     }).on('data', function (data) {
//             //         console.log('STDOUT: ' + data);
//             //     }).stderr.on('data', function (data) {
//             //         console.log('STDERR: ' + data);
//             //     });
//             //     stream.end('ls -l\nexit\n');
//             // });

//             resolve(conn);
//         }).connect({
//             host: '192.168.3.10',
//             port: 22,
//             username: 'gushenxing',
//             password: 'gushenxing123'
//         });

//     });
// }


var remoteExec=function(loginInfo,cmd,callback){
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
// var sshClient = connect(conn);

// sshClient.then(function (conn) {
//     conn.shell(function (err, stream) {
//         if (err) throw err;

//         // conn.exec('uname -a', function (err, stream) {

//         // })
//         stream.on('close', function () {
//             console.log('Stream :: close');
//             conn.end();
//         }).on('data', function (data) {
//             console.log('STDOUT: ' + data);
//         }).stderr.on('data', function (data) {
//             console.log('STDERR: ' + data);
//         });
//         stream.end('ls -l\nexit\n');
//     });

// });

// conn.on('ready', function() {
//     console.log('Client :: ready');
//     conn.exec('sudo fdisk -l', function(err, stream) {
//       if (err) throw err;
//       stream.on('close', function(code, signal) {
//         console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
//         conn.end();
//       }).on('data', function(data) {
//         console.log('STDOUT: ' + data);
//       }).stderr.on('data', function(data) {
//         console.log('STDERR: ' + data);
//       });
//     });
//   }).connect({
//     host: '192.168.3.10',
//     port: 22,
//     username: 'gushenxing',
//     password: 'gushenxing123'
// });


remoteExec(loginInfo,"sudo fdisk -l",function(err,data,errData){
    if(err) throw err;
    if(data) console.log(data.toString());
    if(errData) logger.error(errData.toString());
    
})