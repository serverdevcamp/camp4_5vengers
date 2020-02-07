var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const User = require('../../model/user');
// const encrypt = require('../../module/encryption');


router.post('/', async(req, res) => {
    try {
        const { id, name, email, pwd, nick } = req.body;
        User.signUp({ id, name, email, pwd, nick })
            .then(({ code, json }) => res.status(code).send(json))
            .catch(err => {
                console.log(err);
                res.status(statusCode.INTERNAL_SERVER_ERROR,
                    util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"))
            })
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;