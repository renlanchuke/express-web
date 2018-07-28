var sshClient = require('./sshClient.js');
var config = require('./config');
var logger = require("./common").logger;


function createFS(ip, fsName, pool1, pool2, callback) {
    let cmd = "sudo ceph fs new " + fsName + " " + pool1 + " " + pool2;
    sshClient.remoteExec(config.getLoginInfo(ip), cmd
        , function (err, data, errData) {
            if (err && err !== '') {
                callback(err);
                return;
            }

            if (errData && errData !== '') {
                callback(errData, null);
                logger.error(errData);
                return;
            }
            //'pool {poolname} created' means pool created successful
            if (data.indexOf('created') > 0) {
                callback(null, data);
            } else {
                callback(data);
            }
        });
}


function mountFS(client_ip, path, fsName, MDS_ip, callback) {
    let cmd = "sudo mount -t ceph " + MDS_ip + ":6789:/ " + path + " -o name=admin,secret=";
    sshClient.remoteExec(config.getLoginInfo(MDS_ip), "sudo cat /etc/ceph/ceph.client.admin.keyring"
        , function (err, data, errData) {
            if (err && err !== '') {
                callback(err);
                return;
            }

            if (errData && errData !== '') {
                callback(errData, null);
                logger.error(errData);
                return;
            }

            var token = data.toString();
            let from = token.indexOf("key") + 6;
            let length = token.indexOf("==") + 2 - from;
            token = token.substr(from, length);
            cmd = cmd + token;

            sshClient.remoteExec(config.getLoginInfo(client_ip), "sudo mkdir " + path + "\n" + cmd
                , function (err, data, errData) {
                    if (err && err !== '') {
                        callback(err);
                        return;
                    }

                    if (errData && errData !== '') {
                        callback(errData, null);
                        logger.error(errData);
                        return;
                    }

                    callback(null, data);

                });

        });

}

function getURLs(callback){
    

}

exports.mountFS = mountFS;