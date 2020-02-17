var express = require('express');
var router = express.Router();
var room = require('../controller/room');

router.post('/offline', (req, res) => {
    try{
        var room_idx = req.body['roomIdx'];
        var user_idx = req.body['userIdx'];
        var inRoomDetails = req.body['inRoomDetails']
        console.log(room_idx);
        // 메세지 받아서 저장하기
        room.updateOffline(room_idx, user_idx, inRoomDetails)
        .then(({code, json}) => {
            res.status(code).send(json);
        })
        .catch(err => {
            console.log(err);
            res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR,resMessage.INTERNAL_SERVER_ERROR));
        })
        
    }catch (err) {

    }
});

router.post('/online', (req, res) => {
    try{
        var room_idx = req.body['roomIdx'];
        var user_idx = req.body['userIdx'];
        console.log(room_idx);
        // 메세지 받아서 저장하기
        room.updateOnline(room_idx, user_idx)
        .then(({code, json}) => {
            res.status(code).send(json);
        })
        .catch(err => {
            console.log(err);
            res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR,resMessage.INTERNAL_SERVER_ERROR));
        })
        
    }catch (err) {

    }
});

router.post('/readCount', (req, res) => {
    try{
        var room_idx = req.body['roomIdx'];
        room.getReadCount(room_idx)
        .then(({code, json}) => {
            res.status(code).send(json);
        })
        .catch(err => {
            console.log(err);
            res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR,resMessage.INTERNAL_SERVER_ERROR));
        })

    }catch (err) {

    }
});

router.post('/name', (req, res) => {
    try{
        console.log('방 이름: ', req.body['roomName']);
        console.log('방 idx : ', req.body['roomIdx'])
        var room_name = req.body['roomName'];
        var room_idx = req.body['roomIdx'];
        room.updateRoomName(room_name, room_idx)
        .then(({code, json}) => {
            res.status(code).send(json);
        })
        .catch(err => {
            console.log(err);
            res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR,resMessage.INTERNAL_SERVER_ERROR));
        })

    }catch (err) {

    }
});

module.exports = router;