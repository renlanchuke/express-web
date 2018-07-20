var common = require('./common.js');

var logger = common.logger;

var ip_address = '192.168.3.12:7000';
exports.getOSDList = function (ip_address, callback) {
    let url = ip_address + '/osd/list_data';

    common.get(url, null, function (err, data) {
        if (err) {
            logger.error("Error accur while get osd data list");
            return;
        }
        var jsonData = JSON.parse(data);
        logger.info("data: ", jsonData);
    });
}

exports.getServerInfo = function (callback) {
    let api = getMgrIp() + '/servers_data';

    var res = [];
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