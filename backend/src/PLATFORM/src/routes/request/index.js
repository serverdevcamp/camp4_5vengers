var express = require('express');
var router = express.Router();

const sendList = require('./sendList');
const receiveList = require('./receiveList');
const accept = require('./accept');
const send = require('./send');
const friendList = require('./friendList');
const invite = require('./invite');

router.use('/sendList', sendList);
router.use('/receiveList', receiveList);
router.use('/accept', accept);
router.use('/send', send);
router.use('/friendList', friendList);
router.use('/invite', invite);

module.exports = router;
