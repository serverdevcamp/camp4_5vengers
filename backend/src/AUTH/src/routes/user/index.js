var express = require('express');
var router = express.Router();

const signIn = require('./signIn');
const signUp = require('./signUp');
const auth = require('./auth');
const home = require('./home');

router.use('/signIn', signIn);
router.use('/signUp', signUp);
router.use('/auth', auth);
router.use('/home', home);

module.exports = router;
