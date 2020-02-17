var express = require('express');
var router = express.Router();
var faker = require('faker');
var moment = require('moment');
var server = require('http').createServer();
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var Redis = require('ioredis');
var redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379';
var redis = new Redis(redis_address);
var redis_subscribers = {};
var channel_history_max = 20;
const db = require('../module/pool');
const chat = require('../controller/chat');

router.post('/', (req, res) => {
    // redis.flushall();
    function add_redis_subscriber(subscriber_key) {
        console.log("???");
        var client = new Redis(redis_address);
    
        client.subscribe(subscriber_key);
        client.on('message', function(channel, message) {
            io.emit(subscriber_key, JSON.parse(message));
        });
    
        redis_subscribers[subscriber_key] = client;
    }
    add_redis_subscriber('messages');
    add_redis_subscriber('member_add');
    add_redis_subscriber('member_delete');
    
    io.on('connection', function(socket) {//여기에 함수 인자로 room_idx를 받아야한다.
        var room_idx = socket.handshake.query.roomIdx;
    
        var get_members = redis.hgetall('members').then(function(redis_members) {
            console.log("2");
            var members = {};
            for (var key in redis_members) {
            //   console.log(key);
                members[key] = JSON.parse(redis_members[key]);
            }
            return members;
        });
    
        var initialize_member = get_members.then(function(members) {//톡방에 메세지를 남긴 사람들
            console.log("3");
            if (members[room_idx]) {
                return members[room_idx];
            }
    
            var username = faker.fake("{{name.firstName}} {{name.lastName}}");
            var member = {
                room_idx: room_idx,
                nick: username,
                front_img: "//api.adorable.io/avatars/30/" + username + '.png'
            };
    
            return redis.hset('members', room_idx, JSON.stringify(member)).then(function() {
                return member;
            });
        });
    
        // get the highest ranking messages (most recent) up to channel_history_max size
        var get_messages = redis.zrange('messages', -1 * channel_history_max, -1).then(function(result) {
            console.log("4");
            return result.map(function(x) {
                return JSON.parse(x);
            });
        });
    
        Promise.all([get_members, initialize_member, get_messages]).then(function(values) {
            console.log("1");
            var members = values[0];
            var member = values[1];
            var messages = values[2];
    
            //여기서 동시접속자수가 몇 명인지를 판별한다.(db의 online_dt>offline_dt이면 지금 접속중이라는 것)
    
    
            io.emit('member_history', members);
            io.emit('message_history', messages);
    
            redis.publish('member_add', JSON.stringify(member));
    
            socket.on('send', async function(info) {
            //   console.log(info.userIdx);
                var date = moment.now();
                const getUserQuery = 'SELECT nick, profile FROM user WHERE Idx = ?'
                const getUserResult = await db.queryParam_Parse(getUserQuery , [info.userIdx]);
                const getReadQuery = 'SELECT COUNT(*) FROM room_person WHERE room_idx = ? AND online_dt > offline_dt'
                const getReadResult = await db.queryParam_Parse(getReadQuery , [info.room_idx]);
                var message = JSON.stringify({
                    regist_dt: date,
                    nick: getUserResult[0]['nick'],
                    front_img: JSON.parse(getUserResult[0]['profile'])['profile_front'],
                    message: info.message,
                    room_idx: info.room_idx,
                    user_idx: info.userIdx,
                    read_count: getReadResult[0]['COUNT(*)']
                });
    
                redis.zadd('messages', date, message);
                redis.publish('messages', message);
            });
    
            socket.on('disconnect', function() {
                console.log("끊겼어~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                redis.hdel('members', room_idx);
                redis.publish('member_delete', JSON.stringify(room_idx));
            });
        }).catch(function(reason) {
            console.log('ERROR: ' + reason);
        });
    });
    
    server.listen(port, function() {
        console.log('Started server on port ' + port);
    });
});

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