const router = require('express').Router();
var logger = require('../services/common').logger;

router.get('/', function (req, res) {
    if (req.user) {
      res.json({
        data: {},
        code: 0,
        message: "ok"
      })
    } else {
      res.json({
        data: {},
        code: 3,
        message: "No Authentication"
      })
    }
  });

  module.exports = router;