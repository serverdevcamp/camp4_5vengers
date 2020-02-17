var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const Request = require('../../model/request');

router.get('/', async (req, res) => {
    try {
        const { accessToken } = req.header;

        Request.sendList({ accessToken })
            .then(({ code, json }) => res.status(code).send(json))
            .catch(err => {
                console.log(err);
                res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"));
            })

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
