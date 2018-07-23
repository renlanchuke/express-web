const router = require('express').Router();
var _ = require('underscore');
var mongoose = require('mongoose');


var logger = require('../services/common').logger;
var rack = require('../collections/rack.js')
var pNode = require('../collections/PNode.js');

var cephManage = require('../services/cephManage.js');



router.get('/', function (req, res) {
    rack.find({}, (err, docs) => {
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
    }).populate({ path: 'pnode', select: 'hostname' });
});
/**
 * METHOD POST
 * @name
 * @location
 */
router.post('/', function (req, res) {

    if (!req.body.name) {
        res.json({
            data: {},
            code: 5,
            message: "No rack name"
        });

        return;
    }

    if (!req.body.location) {
        res.json({
            data: {},
            code: 5,
            message: "No rack location"
        });

        return;
    }

    var Rack = new rack({
        _id: req.body.name,
        name: req.body.name,
        location: req.body.location
    });

    Rack.save(function (err) {
        if (err) {
            res.json({
                data: {},
                code: 4,
                message: err
            });
            return;
        }

        res.json({
            data: {
                name: Rack.name,
                location: Rack.location
            },
            code: 0,
            message: "ok"
        });
    })
});

router.get('/:name', function (req, res) {
    rack.findOne({ 'name': req.params.name })
        .populate('pnode', 'hostname')
        .exec(function (err, doc) {
            if (err) {
                res.json({
                    data: {},
                    code: 4,
                    message: err
                });
            } else {
                res.json({
                    data: doc,
                    code: 0,
                    message: "ok"
                });
            }
        });
});

router.put('/:name', function (req, res) {

    if (!req.body.pNodeName || req.body.pNodeName.length === 0) {
        res.json({
            data: {},
            code: 5,
            message: "No Correct pNode name"
        });
    }

    //get rack by name
    var promise1 = mongoose.model('Rack').findOne({ 'name': req.params.name }).exec();
    //get PNode by hostname
    var promise2 = mongoose.model('PNode').findOne({ 'hostname': req.body.pNodeName }).exec();

    //after get rack and pnode, add pnode id to rack.pnode
    Promise.all([promise1, promise2]).then(function ([rack_doc, pnode_doc]) {
        var ip = pnode_doc._id;
        //if rack's pnode contains the pnode's id, do nothing
        if (_.contains(rack_doc.pnode, ip)) {
            res.json({
                data: {},
                code: 5,
                message: "The pnode has been in the rack"
            });
        } else {
            rack_doc.pnode.push(ip);
            rack_doc.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    res.json({
                        data: rack_doc,
                        code: 0,
                        message: "ok"
                    });
                }
            });
        }
        // res.json({
        //     data: {
        //         doc1: rack_doc,
        //         doc2: pnode_doc
        //     },
        //     code: 0,
        //     message: "No Correct pNode name"
        // });
        console.log(rack_doc, pnode_doc);
    }).catch(function (err) {
        logger.error(err);
        if (err && err != {}) {
            res.json({
                data: {},
                code: 4,
                message: "Server accur some error!"
            });
        }

    })
})

router.delete('/:name', function (req, res) {

    if (!req.body.pNodeName || req.body.pNodeName.length === 0) {
        res.json({
            data: {},
            code: 5,
            message: "No Correct pNode name"
        });
    }

    //get rack by name
    var promise1 = mongoose.model('Rack').findOne({ 'name': req.params.name }).exec();
    //get PNode by hostname
    var promise2 = mongoose.model('PNode').findOne({ 'hostname': req.body.pNodeName }).exec();

    //after get rack and pnode, add pnode id to rack.pnode
    Promise.all([promise1, promise2]).then(function ([rack_doc, pnode_doc]) {
        var ip = pnode_doc._id;
        //if rack's pnode contains the pnode's id, do nothing
        if (!_.contains(rack_doc.pnode, ip)) {
            res.json({
                data: {},
                code: 5,
                message: "The pnode has not been in the rack"
            });
        } else {
            rack_doc.pnode = _.without(rack_doc.pnode, ip);
            rack_doc.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    res.json({
                        data: rack_doc,
                        code: 0,
                        message: "ok"
                    });
                }
            });
        }
    }).catch(function (err) {
        logger.error(err);
        if (err && err != {}) {
            res.json({
                data: {},
                code: 4,
                message: "Server accur some error!"
            });
        }

    })
})



function ip_exam(ip) {
    var pattern = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/
    return pattern.test(ip);
}


module.exports = router;