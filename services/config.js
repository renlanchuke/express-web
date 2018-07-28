//get admin node ip address
exports.getAdminIp = function () {
    return "192.168.3.9";
}

//get {ip} node ssh login info
exports.getLoginInfo = function (ip) {
    return loginInfo = {
        host: ip,
        port: 22,
        username: 'gushenxing',
        password: 'gushenxing123'
    };
}

exports.getMDSIp = function (ip) {
    return "192.168.3.11";
}

