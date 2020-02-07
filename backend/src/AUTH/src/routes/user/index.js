var express = require('express');
var router = express.Router();

const signIn = require('./signIn');
const signUp = require('./signUp');
const auth = require('./auth');

router.use('/signIn', signIn);
router.use('/signUp', signUp);
router.use('/auth', auth);

module.exports = router;
