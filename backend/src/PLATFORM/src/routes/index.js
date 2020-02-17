var express = require('express');
var router = express.Router();

const room = require('./room/index');
const request = require('./request/index');

router.use('/room', room);
router.use('/request', request);


module.exports = router;
