var express = require('express');
var router = express.Router();

const main = require('./main');
const friendList = require('./friendList');
const create = require('./create');
const privateChat = require('./privateChat');

router.use('/main', main);
router.use('/friendList', friendList);
router.use('/create', create);
router.use('/privateChat', privateChat);


module.exports = router;
