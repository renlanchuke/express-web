var _ = require("underscore")
var logger = require('./common.js').logger;
var sshClient = require('./sshClient.js');
var PNode = require('../collections/PNode.js');
var request = require('./request.js');


function getMgrDump(ip, callback) {

    sshClient.remoteExec(getLoginInfo(ip), "sudo ceph mgr dump"
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
}


/**
 * get all mgr modules
 * @param {*} ip
 * @param {*} callback
*/
function getMgrModules(ip, callback) {

    sshClient.remoteExec(getLoginInfo(ip), "sudo ceph mgr module ls"
        , function (err, data, errData) {
            if (err && err !== '') {
                callback(err);
                return;
            }

            if (errData && errData !== '') {
                callback(errData);
                logger.error(errData);
                return;
            }
            let res = JSON.parse(data);
            callback(null, res);
        });
}

/**
 * start or stop mgr module
 * @param {*} ip 
 * @param {*} moduleName
 * @param {*} action
 * @param {*} callback
 */
function changeModuleState(ip, moduleName, action, callback) {
    let cmd = '';
    if (action === "enable") {
        cmd = "sudo ceph mgr module enable  " + moduleName;
    } else if (action === "disable") {
        cmd = "sudo ceph mgr module disable  " + moduleName
    } else {
        callback("action only support 'enable' and 'disable'");
        return;
    }

    try {
        sshClient.remoteExec(getLoginInfo(ip), cmd
            , function (err, data, errData) {
                if (err && err !== '') {
                    throw err;
                }

                // if (errData && errData !== '') {
                //     callback(errData);
                //     logger.error(errData)
                //     return;
                // }
                // callback(null, data);
            }
        );
        callback(null)
    } catch (e) {
        throw e;
    }



}

/**
 * create mgr daemon of mgr node
 * @param {*} ip 
 * @param {*} callback
 */
function createMgr(ip, callback) {
    let loginInfo = getLoginInfo(getAdminIp());
    PNode.findById(ip, (err, doc) => {
        if (err) {
            callback(err);
            return;
        }

        let cmd = "cd my-cluster\nceph-deploy mgr create " + doc.hostname;
        if (doc) {
            sshClient.remoteExec(loginInfo, cmd
                , function (err, data, errData) {
                    if (err && err !== '') {
                        callback(err);
                        return;
                    }

                    if (errData && errData !== '') {
                        callback(errData);
                        logger.error(errData)
                        return;
                    }

                    doc.isMgr = true;
                    doc.save((err) => {
                        if (err) {
                            callback(err);
                            return;
                        }
                        callback(null, data);

                    });
                }
            );


        } else {
            callback("The Mgr node dosn't exist");
        }

    });

}

/**
 * stop mgr daemon of mgr node
 * @param {*} ip 
 * @param {*} callback 
 */
function stopMgr(ip, callback) {
    let loginInfo = getLoginInfo(getAdminIp);
    PNode.findById(ip, (err, doc) => {
        if (err) {
            callback(err);
            return;
        }
        if (doc) {
            sshClient.remoteExec(getLoginInfo(ip), "sudo systemctl stop ceph-mgr@" + doc.hostname + ".service"
                // , function (err, data, errData) {
                //     if (err && err !== '') {
                //         callback(err);
                //         return;
                //     }

                //     if (errData && errData !== '') {
                //         callback(errData, null);
                //         logger.error(errData);
                //         return;
                //     }

                //     callback(null);
                // }
            );
            callback(null);
        } else {
            callback("The Mgr node dosn't exist");
        }

    });

}

function startpMgr(ip, callback) {
    PNode.findById(ip, (err, doc) => {
        if (err) {
            callback(err);
            return;
        }
        if (doc) {
            sshClient.remoteExec(getLoginInfo(ip), "sudo systemctl start ceph-mgr@" + doc.hostname + ".service"
                // , function (err, data, errData) {
                //     if (err && err !== '') {
                //         callback(err);
                //         return;
                //     }
                //     if (data) {
                //         callback(null, data);
                //     }

                //     if (errData && errData !== '') {
                //         callback(errData, null);
                //         logger.error(errData)
                //     }
                // }
            );

            callback(null)
        } else {
            callback("The Mgr node dosn't exist");
        }

    });

}


/**
 * create osd from hostname and disk
 * @param {*} hostname 
 * @param {*} disk 
 * @param {*} callback  
 * ATTENTION: the callback return data can't inform
 * if create osd successfull
 */


//get admin node ip address
function getAdminIp() {
    return "192.168.3.9";
}

//get {ip} node ssh login info
function getLoginInfo(ip) {
    return loginInfo = {
        host: ip,
        port: 22,
        username: 'gushenxing',
        password: 'gushenxing123'
    };
}

exports.getMgrDump = getMgrDump;
exports.stopMgr = stopMgr;
exports.startpMgr = startpMgr;
exports.createMgr = createMgr;
exports.getMgrModules = getMgrModules
exports.changeModuleState = changeModuleState