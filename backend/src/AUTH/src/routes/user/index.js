var express = require('express');
var router = express.Router();

const signIn = require('./signIn');
const signUp = require('./signUp');
const auth = require('./auth');
const reAccessToken = require('./reAccessToken');

router.use('/signIn', signIn);
router.use('/signUp', signUp);
router.use('/auth', auth);
router.use('/reAccessToken', reAccessToken);

module.exports = router;
