var express = require('express');
var router = express.Router();

const sendList = require('./sendList');
const receiveList = require('./receiveList');
const accept = require('./accept');

router.use('/sendList', sendList);
router.use('/receiveList', receiveList);
router.use('/accept', accept);

module.exports = router;
