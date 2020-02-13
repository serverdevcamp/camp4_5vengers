var express = require('express');
var router = express.Router();

const room = require('./room/index');

router.use('/room', room);


module.exports = router;
