var express = require('express');
var router = express.Router();

const sendList = require('./sendList');

router.use('/sendList', sendList);

module.exports = router;
