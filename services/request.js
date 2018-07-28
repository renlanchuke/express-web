var common = require('./common.js');
var pNode = require("../collections/PNode.js")


var logger = common.logger;
var mongoose = require('mongoose');

var ip = '192.168.3.12:7000';
exports.getOSDList = function (ip, callback) {
    let url = ip + '/osd/list_data';
    let res = []

    common.get(url, null, function (err, data) {
        if (err) {
            logger.error("Error accur while get osd data list");
            callback(err);
            return;
        }
        var jsonData = JSON.parse(data);

        for (nodeTemp of jsonData) {
            let dataNode = {
                hostname: '',
                ip: '',
                osds: []

            }
            //logger.info(nodeTemp);

            dataNode.hostname = nodeTemp[0];


            for (osd of nodeTemp[1]) {
                dataNode.osds.push({
                    id: 'osd.' + osd.id,
                    up: osd.up,
                    in: osd.in,
                    stats: osd.stats
                });

            }
            //logger.info(dataNode);
            res.push(dataNode);

        }

        callback(err, res);
        // logger.info("data: ", res);
    });
}

exports.getHealthData = function (ip, callback) {
    let url = ip + '/health_data';
    let res = new Object();

    common.get(url, null, function (err, data) {
        if (err) {
            logger.error("Error accur while get osd data list");
            callback(err);
            return;
        }
        var jsonData = JSON.parse(data);

        res.health = jsonData.health
        res.pools = jsonData.df.pools;
        res.stats = jsonData.df.stats;
        res.mon_quorum = jsonData.mon_status.quorum;
        res.mgr_status = {
            active_name: jsonData.mgr_map.active_name,
            standbys: jsonData.mgr_map.standbys.length
        }
        // res.mgr_status.active_name = jsonData.mgr_map.active_name;
        // res.mgr_status.standbys = jsonData.mgr_map.standbys.length;
        let temp = jsonData.fs_map.filesystems[0];
        res.mds_status = temp.mdsmap.info;
        res.osds = jsonData.osd_map.osds;
        res.clog = jsonData.clog;
        res.auditLog = jsonData.audit_log

        callback(err, res);
        logger.info("data: ", res);
    });
}

exports.getServerInfo = function (callback) {
    let api = getMgrIp() + '/servers_data';


    common.get(api, null, function (err, data) {
        if (err) {
            logger.error("Error accur while get osd data list");
            callback(err);
            return;
        }
        var jsonData = JSON.parse(data);
        for (let i of jsonData.servers) {
            let result = createServerInfo();
            result.hostname = i.hostname;
            for (let j of i.services) {
                if (j.type === 'mon') {
                    result.mon = true;
                }

                if (j.type === 'mds') {
                    result.mds = true;
                }
                if (j.type === 'rgw') {
                    result.rgw = true
                }

                if (j.type === 'osd') {
                    result.osd.push('osd.' + j.id);
                }
            }
            res.push(result);

        }
        callback(null, res);
    });
}
exports.getDashboard = function (query, start, end, step, callback) {
    var username = "admin";
    var password = "admin";
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    let api = "/api/datasources/proxy/2/api/v1/query_range";
    let qyery_string = getDashboardIp() + api + "?query=" + query + "&start=" + start + "&end=" + end + "&step=" + step;
    common.authget(qyery_string, auth, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(data));
        }
    })
}


exports.getFSInfo = function (callback) {
    let api = getMgrIp() + "/toplevel_data";

    common.get(api, null, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        let jsonData = JSON.parse(data);
        let urls = jsonData.filesystems;
        // logger.info(urls);
        let results = [];

        getFSData(results, urls, 0, function (err, data) {
            if (err) {
                callback(err);
                return;
            } else {
                callback(null, data);
            }
        });

    })


    function getFSData(results, urls, index, callback) {
        if (index < urls.length) {
            let url = getMgrIp() + urls[index].url;
            url=url.replace("filesystem","filesystem_data");
            logger.info(url)
            common.get(url, null, function (err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                results.push(JSON.parse(data));

                getFSData(results, urls, index + 1, callback);

            });
        } else {
            callback(null, results);
        }
    }


}
function createServerInfo() {
    let serverInfo = new Object();
    serverInfo.hostname = '';
    serverInfo.mon = false;
    serverInfo.mds = false;
    serverInfo.mgr = false;
    serverInfo.rgw = false;
    serverInfo.osd = [];

    return serverInfo;
}

function getMgrIp() {
    return 'http://192.168.3.12:7000';
}

function getDashboardIp() {
    return "http://192.168.3.143:3000";
}

