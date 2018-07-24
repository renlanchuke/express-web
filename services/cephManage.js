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

        if (!doc) {
            callback('NO PNode find');
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


exports.getPNodeByIp = function (ip, callback) {
    PNode.findOne({ 'ip': ip }, function (err, doc) {
        if (err) {
            logger.error("Error while query PNode", err);
            callback(err);
            return;
        }

        if (!doc) {
            callback('NO PNode find');
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

/**
 * get OSD info from remote server
 * @param {*} ip 
 * @param {*} osd 
 * @param {*} callback 
 */
function getOSDInfo(ip, osd, callback) {
    osd = osd.replace('.', '-').replace('osd', 'ceph');
    let arr = [];
    let ceph_fsid = '';

    let result = new Object();
    sshClient.remoteExec(getLoginInfo(ip), "sudo cat /var/lib/ceph/osd/" + osd + "/fsid\n" +
        "sudo lvscan\n" + "sudo pvscan\n"
        , function (err, data, errData) {
            if (err && err !== '') {
                callback(err);
                return;
            }
            if (data && data != '') {

                //data = data.replace('\n', '');

                arr = data.split('\n\n');
                result.fsid = arr[0].trim();

                for (let i = 1; i < arr.length; i++) {
                    // logger.info(arr);
                    if (arr[i].indexOf(result.fsid) > 0) {

                        //console.log(ceph_fsid);
                        let from = arr[i].indexOf('\'/dev/') + 6;
                        let len = arr[i].indexOf('\/osd-block') - from;
                        ceph_fsid = arr[i].substr(from, len);

                        from = arr[i].indexOf('[') + 1;
                        len = arr[i].indexOf(']') - from
                        result.size = arr[i].substr(from, len);
                        result.ceph_fsid = ceph_fsid;

                        arr[i] = '';

                    }

                    if (ceph_fsid.length > 0 && arr[i].indexOf(result.ceph_fsid) > 0) {


                        //console.log(ceph_fsid);
                        let from = arr[i].indexOf('PV ') + 3;
                        let len = arr[i].indexOf('   VG') - from;
                        result.disk = arr[i].substr(from, len);

                    }
                }
                callback(null, result)
                //logger.info(result);
            }

            if (errData && errData !== '') {
                callback(null, null, errData);
                logger.error(errData)
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
exports.createOSD = function (hostname, disk, callback) {
    let loginInfo = getLoginInfo(getAdminIp());

    sshClient.remoteExec(loginInfo, "cd /home/gushenxing/my-cluster\n" + "ceph-deploy osd create --data " + disk + " " + hostname, function (err, data, errData) {
        let arr = new Array();
        let result = [];
        if (err) callback(err);
        if (data) {
            callback(null, data);
            //console.log(result.toString());
        }
        if (errData) {
            callback(null, null, errData)
        }
    });

}
//delete osd and delete volume on disk
exports.deleteOSD = function (ip, osd, callback) {

    getOSDInfo(ip, osd, function (err, osdInfo, errData) {
        //logger.info(osdInfo);
        if (err) {

            callback(err);

            return;
        }
        if (errData) {

            callback(null, null, errData);

            return;
        }
        logger.info(osdInfo);


        //delele OSD cmd
        let osd_num = osd.replace('osd.', '');
        let out_osd = "sudo ceph osd out " + osd_num + "\n";
        let stop_osd = "sudo systemctl stop ceph-osd@" + osd_num + ".service\n";
        let remove_osd = "sudo ceph osd crush remove " + osd + "\n";
        let remove_auth = "sudo ceph auth del " + osd + "\n";
        let delete_osd = "sudo ceph osd rm " + osd_num + "\n"

        //delete logical volume,volume group and of the OSD
        //logical volume
        let logicalVolueme = osdInfo.ceph_fsid + "/osd-block-" + osdInfo.fsid;
        let rmLV = "echo \"y\"|sudo lvremove " + logicalVolueme + "\n";

        //delete volume group
        let rmVG = "sudo vgremove " + osdInfo.ceph_fsid + "\n";

        //delete physic volume
        let rmPV = "sudo pvremove " + osdInfo.disk + "\n";


        let deleteOSDcmd = out_osd + stop_osd + remove_osd + remove_auth + delete_osd;
        let deleteVolumecmd = rmLV + rmVG + rmPV;

        //let cmd = out_osd;

        //console.log(deleteVolumecmd);
        sshClient.remoteExec(loginInfo, deleteOSDcmd + deleteVolumecmd, function (err, data, errData) {

            if (err) {
                callback(err);
                return;
            }

            if (data) {
                callback(null, data);
                //console.log(result.toString());
            }

            if (errData) {
                callback(null, null, errData)
            }
        });

    });




}
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

exports.getOSDInfo = getOSDInfo;