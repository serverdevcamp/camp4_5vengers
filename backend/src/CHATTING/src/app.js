var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var headerParser = require('header-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();
var faker = require('faker');
var moment = require('moment');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3002;
var Redis = require('ioredis');
var redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379';
var redis = new Redis(redis_address);

var redis_subscribers = {};
var channel_history_max = 200;
const db = require('./module/pool');

const corsOptions = {
  origin: 'http://localhost:8080', // 허락하고자 하는 요청 주소
  credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

app.use(cors(corsOptions)); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(headerParser);
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);

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

      io.emit('member_history', members);
      io.emit('message_history', messages);

      redis.publish('member_add', JSON.stringify(member));

      socket.on('send', async function(info) {
          var date = moment.now();
          const getUserQuery = 'SELECT nick, profile FROM user WHERE Idx = ?'
          const getUserResult = await db.queryParam_Parse(getUserQuery , [info.userIdx]);
          const getReadQuery = 'SELECT user_idx FROM room_person WHERE room_idx = ? AND online_dt > offline_dt'//접속중인 유저가 몇 명인지 센다
          const getReadResult = await db.queryParam_Parse(getReadQuery , [info.room_idx]);
          console.log(getReadResult.length);
          
          var array = []
          for(i=0; i<getReadResult.length; i++){
            array.push(getReadResult[i]['user_idx'])
          }
          var object = { "reader": array }

          //아예 여기서 고유한 idx값을 만들어서 redis_idx 이렇게 넣어주기(regist_dt+user_idx)??
          var message = JSON.stringify({
              regist_dt: date,
              nick: getUserResult[0]['nick'],
              front_img: JSON.parse(getUserResult[0]['profile'])['profile_front'],
              message: info.message,
              room_idx: info.room_idx,
              user_idx: info.userIdx,
              read_count: (info.mem_count-getReadResult.length),
              redis_idx: String(date)+String(info.userIdx)//메세지의 고유 idx
          });

          redis.zadd('messages', date, message);
          redis.publish('messages', message);

          //chatting 테이블에 insert해주기(regist_count->(info.mem_count-getReadResult[0]['COUNT(*)'])
          const insertChatQuery = 'INSERT INTO chatting (regist_dt, msg_idx, room_idx, regist_count, reader, message) VALUES (?, ?, ?, ?, ?, ?)'
          const insertChatResult = await db.queryParam_Parse(insertChatQuery , [String(date), String(date)+String(info.userIdx), info.room_idx, (info.mem_count-getReadResult.length), JSON.stringify(object), info.message]);

        //   //읽은 메세지 수
        //   const selectCountQuery = 'SELECT regist_count FROM chatting WHERE room_idx = ?';
        //   const selectCountResult = await db.queryParam_Parse(selectCountQuery ,[info.roomIdx]);
        //   var list = []
        //     for(i=0; i<selectCountResult.length; i++){
        //         list.push(selectCountResult[i]['regist_count']);
        //     }
        //   socket.emit('readCount', list);
          socket.emit('readSend', (info.mem_count-getReadResult.length));
      });

      //사용자가 읽은 메세지들 확인 후 안 읽었으면 읽은 메세지 수 감소
      //메시지의 regist_dt가 사용자의 offline_dt보다 크다면, 
      socket.on('read', async function(info) {
          //room_person의 last에 저장된 마지막으로 읽은 메시지 idx+1부터 그 채팅방에 있는 모든 메세지의 reader에 사용자를 추가한다.
          //그리고 그 각각의 메세지의 regist_count--  
        const selectLastQuery = 'SELECT last_msg_idx FROM room_person WHERE room_idx = ? AND user_idx = ?';
        const selectLastResult = await db.queryParam_Parse(selectLastQuery , [info.roomIdx, info.userIdx]);
        console.log("last : ", selectLastResult[0]['last_msg_idx']);
        
        //last+1부터 모든 메세지의 reader에 사용자 idx push하기(mysql)
        //그리고 그 각각의 메세지의 regist_count--
        const updateReaderQuery = 'UPDATE chatting SET regist_count = regist_count-1 WHERE room_idx = ? AND idx > ?';
        const updateReaderResult = await db.queryParam_Parse(updateReaderQuery, [info.roomIdx, selectLastResult[0]['last_msg_idx']]);

        //읽은 메세지 수
        const selectCountQuery = 'SELECT regist_count FROM chatting WHERE room_idx = ?';
        const selectCountResult = await db.queryParam_Parse(selectCountQuery ,[info.roomIdx]);
        var list = []
        for(i=0; i<selectCountResult.length; i++){
            list.push(selectCountResult[i]['regist_count']);
        }
        socket.emit('readCount', list);
      });

    //   socket.on('read_next', async function(info) {
    //     //읽은 메세지 수
    //     const selectCountQuery = 'SELECT regist_count FROM chatting WHERE room_idx = ?';
    //     const selectCountResult = await db.queryParam_Parse(selectCountQuery ,[info.roomIdx]);
    //     var list = []
    //     for(i=0; i<selectCountResult.length; i++){
    //         list.push(selectCountResult[i]['regist_count']);
    //     }
    //     socket.emit('readCount', list);
    //   });

      socket.on('disconnect', function() {
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


module.exports = app;