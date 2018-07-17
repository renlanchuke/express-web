const router = require('express').Router();
var logger = require('../services/common').logger;
var DataNode=require('../collections/dataNode.js')
var mongoose=require('mongoose');


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



router.get('/dataNode',function(req,res){
    DataNode.find({},function(err,docs){
        if(err){
            logger.error("Error whilequery dataNode",err);
            res.json({
                data:{},
                code:5,
                message:err
            });

            return;
        }

        res.json({
            data:docs,
            code:0,
            message:'ok'
        });
    });
});

/**
 * WARNING: no duplicate check
 * METHOD: POST
 * PARAMS:
 *  name    string
 *    ip    string
 */
router.post('/saveDataNode', function (req, res) {
    //logger.debug("req name"+" "+JSON.stringify(req.body));
    if (!req.body.name) {
        res.json({
            data: {},
            code: 5,
            message: "No Nodedata Name"
        });

        return;
    }

    if (!req.body.ip) {
        res.json({
            data: {},
            code: 5,
            message: "No Nodedata Ip"
        });

        return;
    }

    var dataNode = new DataNode({
        _id:new mongoose.Types.ObjectId(),
        ip: '192.168.3.145',
        name: 'data_node_1'
    });

    dataNode.save(function (err) {
        if (err) {
            logger.error('Error while save dataNode!', err);
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





module.exports = router;