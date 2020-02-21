var express = require('express');
var router = express.Router();

const friendProfile = require('./friendProfile');
const updateMyProfile = require('./updateMyProfile');

router.use('/friendProfile', friendProfile);
router.use('/updateMyProfile', updateMyProfile);


module.exports = router;
