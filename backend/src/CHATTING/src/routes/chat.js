var express = require('express');
var router = express.Router();

const chat = require('../controller/chat');


router.post('/default', (req, res) => {
    try{
        console.log("default@@@@@@");
        var room_idx = req.body['room_idx'];
        chat.chatRoomInfo(room_idx)
        .then(({code, json}) => {
            res.status(code).send(json);
        })
        .catch(err => {
            console.log(err);
            res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR,resMessage.INTERNAL_SERVER_ERROR));
        })
    }catch(err) {

    }
});
module.exports = router;