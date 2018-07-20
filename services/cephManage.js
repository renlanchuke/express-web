var logger = require('./common.js').logger;
var sshClient = require('./sshClient.js');
var PNode = require('../collections/PNode.js');
var request = require('./request.js');

/**
 * get all disks from the remote server
 * @param {*} ip 
 * @param {*} callback 
 */
exports.getServerDisks = function (ip, callback) {
    let loginInfo = {
        host: ip,
        port: 22,
        username: 'gushenxing',
        password: 'gushenxing123'
    };

    sshClient.remoteExec(loginInfo, "sudo fdisk -l", function (err, data, errData) {
        let arr = new Array();
        let result = [];
        if (err) callback(err);
        if (data) {
            arr = data.split("\n");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].indexOf("Disk /") !== -1)
                    result.push(arr[i])
            }
            callback(null, data);
            //console.log(result.toString());
        }

        if (errData) {
            callback(null, null, errData)
        }
    });

}

exports.getPNodeByHostname = function (hostname, callback) {
    PNode.findOne({ 'hostname': hostname }, function (err, doc) {
        if (err) {
            logger.error("Error while query PNode", err);
            callback(err);
            return;
        }
        request.getServerInfo(function (err, serInfo) {
            if (err) {
                callback(err);
                return;
            }

            for (let i of serInfo) {
                if (doc.hostname === i.hostname) {

                    doc.isMon = i.mon;
                    doc.isRgw = i.rgw;
                    doc.isMDS = i.mds;
                    doc.isMgr = i.mgr
                    doc.osds = i.osd;
                }
            }
            doc.save(function (err) {
                if (err) callback(err);
                else {
                    callback(null, doc);
                }
            })

        })

    })
}