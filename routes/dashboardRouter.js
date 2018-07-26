const router = require('express').Router();
var _ = require('underscore');
var mongoose = require('mongoose');
var request = require('../services/request.js');



var logger = require('../services/common').logger;
var rack = require('../collections/rack.js')
var pNode = require('../collections/PNode.js');



router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    next();
});

router.get("/healthData", function (req, res) {
    request.getHealthData(getMgrIp(), (err, data) => {
        if (err) {
            res.json({
                data: {},
                code: 4,
                message: err
            });
        } else {
            res.json({
                data: data,
                code: 0,
                message: "ok"
            });
        }
    });

});

router.get("/dashboard", function (req, res) {
    request.getDashboard(req.query.query, req.query.start, req.query.end, req.query.step, function (err, data) {
        if (err) {
            res.json({
                data: {},
                code: 4,
                message: err
            })

            return;
        }

        res.json({
            data: data,
            code: 0,
            message: "ok"
        })
    })
})


function getMgrIp() {
    return 'http://192.168.3.12:7000';
}

module.exports = router;