// var common=require("../services/common")
// var reqAPI=require('../services/request.js');
// var dateSring=common.getDateString();
// console.log(dateSring);

//reqAPI.getOSDList('http://192.168.3.12:7000');

var shell = require('shelljs');
var logger = require('../services/common.js').logger;

var Client = require('ssh2').Client;

var conn = new Client();
conn.on('ready', function () {
    console.log('Client :: ready');
    conn.shell(function (err, stream) {
        if (err) throw err;

        conn.exec('uname -a', function (err, stream) {

        })
        stream.on('close', function () {
            console.log('Stream :: close');
            conn.end();
        }).on('data', function (data) {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', function (data) {
            console.log('STDERR: ' + data);
        });
        stream.end('ls -l\nexit\n');
    });
}).connect({
    host: '192.168.3.10',
    port: 22,
    username: 'gushenxing',
    password: 'gushenxing123'
});