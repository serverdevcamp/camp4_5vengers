const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const db = require('../module/pool.js');
const jwtVerify = require('../module/jwtVerify.js');
const _crypto = require('crypto');
const jwt = require('jsonwebtoken');
const _redis = require('redis');
const redisClient = _redis.createClient({
    host: "10.99.13.29", // 변경
    port: 6379
});

module.exports = {
    // 채팅방 목록 조회
    main: ({ accessToken }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []
            
            // 목록 조회 시 필요한것: 방제목, 방 인원수, 마지막 메세지&시간, 멤버 프사들(최대 4개), 안읽은 메세지 개수

            // 1. 토큰 받아온거에서 유저 인덱스 꺼내기
            // 2. (room_person)user_idx에 해당하는 room_idx, room_name 꺼내오기 ==> 방제목 OK
            // 3. (chatting) regist_dt 정렬 해놓고 room_idx에 해당하는 것 중 가장 먼저 있는거 뽑아오기 ==> 마지막 메세지, 시간 OK
            // 4. (room) room.idx = room_idx 일때 mem_count, member 가져오기 ==> 방 인원수 OK 
            // 5. member에 해당하는 사람 프사 가져오기 ==> 멤버 프사들 OK
            // 6. (room_person) 내 user_idx와 그 room_idx로 last (마지막으로 읽은 메세지 인덱스) 가져옴, 
            //    (chatting) idx가 last 보다 크고 해당 room_idx인거의 개수만 셈 ==> 안읽은 메세지 개수 OK


            // {
            //     status: 200,
            //     result: OK,
            //     data: [
            //         {
            //             room_idx: 12,
            //             room_name: "패밀리",
            //             mem_count: 4,
            //             mem_profile: ["dddsf","dsfad","sdfsdf","sdfsf],
            //             last_message: "hi",
            //             last_message_time: "16:00",
            //             not_read_messages: 3
            //         }
            //     ]
            // }
    
            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;
           

            // 가장 최근 메세지 가져오기 -> zrange messages -1 -1
            // client.get('name', (err, reply) => {
            //     console.log(reply);
            // });


        });


    }
};