var sshClient = require('./sshClient.js');
var config = require('./config');

function createPool(ip, name, pg_num, callback) {
    let cmd = "sudo ceph osd pool create " + name + " " + pg_num;
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

function deletePool(ip, name, callback) {
    let cmd = "sudo ceph osd pool delete " + name + " " + name + " --yes-i-really-really-mean-it";
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
            //'pool {poolname} removed' means pool created successful
            if (data.indexOf('removed') > 0) {
                callback(null, data);
            } else {
                callback(data);
            }
        });
}

function setPoolDuplicated(ip, name, size, callback) {
    let cmd = "sudo ceph osd pool set " + name + " size " + size;
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
            //'pool {poolname} removed' means pool created successful
            if (data.indexOf('size to') > 0) {
                callback(null, data);
            } else {
                callback(data);
            }
        });
}

function setPoolPg_num(ip, name, pg_num, callback) {
    let cmd = "sudo ceph osd pool set " + name + " pg_num " + pg_num;
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
            //'pool {poolname} removed' means pool created successful
            if (data.indexOf('pg_num to') > 0) {
                callback(null, data);
            } else {
                callback(data);
            }
        });
}

function setPoolPgp_num(ip, name, pgp_num, callback) {
    let cmd = "sudo ceph osd pool set " + name + " pgp_num " + pgp_num;
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
            //'pool {poolname} removed' means pool created successful
            if (data.indexOf('pgp_num to') > 0) {
                callback(null, data);
            } else {
                callback(data);
            }
        });
}

function setPoolMax_objects(ip, name, max_objects, callback) {
    let cmd = "sudo ceph osd pool set-quota " + name + " max_objects " + max_objects;
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
            //'pool {poolname} removed' means pool created successful
            if (data.indexOf('set-quota max_objects') > 0) {
                callback(null, data);
            } else {
                callback(data);
            }
        });
}




exports.createPool = createPool;
exports.deletePool = deletePool;
exports.setPoolDuplicated = setPoolDuplicated;
exports.setPoolPg_num = setPoolPg_num;
exports.setPoolPgp_num = setPoolPgp_num;
exports.setPoolMax_objects = setPoolMax_objects;

