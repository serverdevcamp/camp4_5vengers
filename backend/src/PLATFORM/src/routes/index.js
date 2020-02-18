var express = require('express');
var router = express.Router();

const room = require('./room/index');
const request = require('./request/index');
const home = require('./home/index');

router.use('/room', room);
router.use('/request', request);
router.use('/home', home);


module.exports = router;
