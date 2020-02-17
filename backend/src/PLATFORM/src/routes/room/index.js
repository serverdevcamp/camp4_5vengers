var express = require('express');
var router = express.Router();

const main = require('./main');
const friendList = require('./friendList');
const create = require('./create');

router.use('/main', main);
router.use('/friendList', friendList);
router.use('/create', create);

module.exports = router;
