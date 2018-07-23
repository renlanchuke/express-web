const router = require('express').Router();
var logger = require('../services/common').logger;
var DataNode = require('../collections/dataNode.js')
var pNode = require('../collections/PNode.js');

var cephManage = require('../services/cephManage.js');


router.get('/', function (req, res) {

    res.json({
        data: {},
        code: 0,
        message: "ok"
    });

});

router.get('/test', function (req, res) {

    res.json({
        data: {},
        code: 0,
        message: "ok"
    });

});

router.get('/disks/:ip', function (req, res) {
    let ip = req.params.ip;

    var pattern = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/
    if (!pattern.test(ip)) {
        res.json({
            data: {},
            code: 5,
            message: "NOT Correct IP Address"
        });

        return;
    }

    cephManage.getServerDisks(ip, function (err, data, errData) {
        if (err) {
            res.json({
                data: {},
                code: 2,
                message: err
            });
        }

        if (data) {
            res.json({
                data: data,
                code: 0,
                message: "ok"
            });
        }

        if (errData) {
            res.json({
                data: {},
                code: 2,
                message: errData
            });
        }
    });

});

/**
 * GET PNode by hostname
 * @param hostname
 * 
 */
router.get('/pnode/:hostname', function (req, res) {
    cephManage.getPNodeByHostname(req.params.hostname, function (err, pnode) {
        if (err) {
            logger.error("Error while query dataNode", err);
            res.json({
                data: {},
                code: 5,
                message: err
            });

            return;
        }

        res.json({
            data: pnode,
            code: 0,
            message: 'ok'
        });
    });
});

router.get('/pnode_by_ip/:ip', function (req, res) {
    let ip = req.params.ip;
    if (!ip_exam(ip)) {
        res.json({
            data: {},
            code: 5,
            message: "NOT Correct IP Address"
        });

        return;
    }


    cephManage.getPNodeByIp(ip, function (err, pnode) {
        if (err) {
            logger.error("Error while query dataNode", err);
            res.json({
                data: {},
                code: 5,
                message: err
            });

            return;
        }

        res.json({
            data: pnode,
            code: 0,
            message: 'ok'
        });
    });
});

/**
 * WARNING: no duplicate check
 * METHOD: POST
 *  name    string
 *    ip    string
 *     
 */
router.post('/pNode', function (req, res) {
    //logger.debug("req name"+" "+JSON.stringify(req.body));
    if (!req.body.hostname) {
        res.json({
            data: {},
            code: 5,
            message: "No node hostname"
        });

        return;
    }

    if (!req.body.ip) {
        res.json({
            data: {},
            code: 5,
            message: "No Ip"
        });

        return;
    }

    var PNode = new pNode({
        _id: req.body.ip,
        ip: req.body.ip,
        hostname: req.body.hostname
    });

    PNode.save(function (err) {
        if (err) {
            logger.error('Error while save Node!', err);
            res.json({
                data: {},
                code: 4,
                message: err
            })
        } else {
            res.json({
                data: {},
                code: 0,
                message: "Save Successful"
            });
        }
    });
});




router.get('/pNode', function (req, res) {
    pNode.find({}, (err, docs) => {
        if (err) res.json({
            data: {},
            code: 4,
            message: err
        });

        res.json({
            data: {},
            code: 0,
            message: docs
        });
    })
});
/**
 * create Mgr node
 * METHOD PUT
 * @param hostname
 * @param ip
 */
router.post('/mgrNode', function (req, res) {
    //logger.debug("req name"+" "+JSON.stringify(req.body));
    if (!req.body.hostname) {
        res.json({
            data: {},
            code: 5,
            message: "No node hostname"
        });

        return;
    }

    if (!req.body.ip) {
        res.json({
            data: {},
            code: 5,
            message: "No Ip"
        });

        return;
    }

    var PNode = new pNode({
        _id: req.body.ip,
        ip: req.body.ip,
        hostname: req.body.hostname,
        isMgr: true
    });

    PNode.save(function (err) {
        if (err) {
            logger.error('Error while save Node!', err);
            res.json({
                data: {},
                code: 4,
                message: err
            })
        } else {
            res.json({
                data: {},
                code: 0,
                message: "Save Successful"
            });
        }
    });
});

/**
 * get mgrNode Info
 * METHOD GET
 */
router.get('/mgrNode', function (req, res) {
    pNode.find({ 'isMgr': true }, (err, docs) => {

        if (err) {
            res.json({
                data: {},
                code: 4,
                message: err
            });
            return;
        }
        let result = [];

        cephManage.getMgrDump(docs[0].ip, (err, data) => {
            if (err) {
                res.json({
                    data: {},
                    code: 4,
                    message: err
                });
                return;
            }

            if (!data) {
                res.json({
                    data: {},
                    code: 4,
                    message: "can't find mgr node!"
                });
            }
            let mgrDump = JSON.parse(data);

            logger.debug(data);
            for (let mgrNode of docs) {

                let resNode = {
                    hostname: mgrNode.hostname,
                    ip: mgrNode.ip,
                    state: "stop"
                }

                if (resNode.hostname === mgrDump.active_name) {
                    resNode.state = "running"
                } else {
                    for (let sandby of mgrDump.standbys) {
                        if (resNode.hostname === sandby.name) {
                            resNode.state = "sandby"
                        }
                    }
                }
                result.push(resNode);
            }

            res.json({
                data: result,
                code: 0,
                message: "ok"
            });

        });
    })
});

/**
 * change mgrNode state
 * METHOD GET
 */
router.put('/mgrNode/:ip', function (req, res) {
    if (req.body.state === "stop") {
        cephManage.stopMgr(req.params.ip, function (err) {
            if (err) {
                res.json({
                    data: {},
                    code: 5,
                    message: err
                });
            } else {
                res.json({
                    data: {},
                    code: 0,
                    message: "ok"
                });
            }
        });
    } else if (req.body.state === "sandby") {
        cephManage.startpMgr(req.params.ip, function (err) {
            if (err) {
                res.json({
                    data: {},
                    code: 5,
                    message: err
                });
            } else {
                res.json({
                    data: {},
                    code: 0,
                    message: "ok"
                });
            }
        });
    } else if (req.body.state === "create") {
        cephManage.createMgr(req.params.ip, function (err) {
            if (err) {
                res.json({
                    data: {},
                    code: 5,
                    message: err
                });
            } else {
                res.json({
                    data: {},
                    code: 0,
                    message: "ok"
                });
            }
        });
    } else {
        res.json({
            data: {},
            code: 5,
            message: "state only support 'stop','sandby' and 'create'"
        })
    }
});

router.delete('/mgrNode')





function ip_exam(ip) {
    var pattern = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/
    return pattern.test(ip);
}


module.exports = router;