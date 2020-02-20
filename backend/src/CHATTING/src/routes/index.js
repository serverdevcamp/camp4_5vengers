var express = require('express');
var router = express.Router();

router.use('/room', require('./room'));
router.use('/chat', require('./chat'));

module.exports = router;
