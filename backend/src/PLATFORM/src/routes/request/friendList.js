var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const Request = require('../../model/request');

router.post('/:by', async (req, res) => {
    try {
        if (req.params.by == 'email') {
            const object = {
                accessToken: req.body.accessToken,
                input: req.body.input,
                by: 'email'
            }

            Request.friendList(object)
                .then(({ code, json }) => res.status(code).send(json))
                .catch(err => {
                    console.log(err);
                    res.status(statusCode.INTERNAL_SERVER_ERROR)
                        .send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"));
                })

        }
        else if (req.params.by == 'id') {
            const object = {
                accessToken: req.body.accessToken,
                input: req.body.input,
                by: 'id'
            }

            Request.friendList(object)
                .then(({ code, json }) => res.status(code).send(json))
                .catch(err => {
                    console.log(err);
                    res.status(statusCode.INTERNAL_SERVER_ERROR)
                        .send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"));
                })
        }



    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
