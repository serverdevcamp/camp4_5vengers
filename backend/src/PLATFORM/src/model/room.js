const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const db = require('../module/pool.js');
const jwtVerify = require('../module/jwtVerify.js');
const moment = require('moment');
const _crypto = require('crypto');
const jwt = require('jsonwebtoken');
const _redis = require('redis');
// const redisClient = _redis.createClient({
//     host: "10.99.13.29", // 변경
//     port: 6379
// });

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

            // [room_person] => room_idx, room_name, last_msg_idx
            // [room] => mem_count, member
            // [chatting] => message, regist_dt



            // {
            //     status: 200,
            //     result: OK,
            //     data: [
            //         {
            //             room_idx: 12,
            //             room_name: "패밀리",
            //             mem_count: 4,
            //             mem_profile: ["dddsf","dsfad","sdfsdf","sdfsf],
            //             last_message_idx: 30,
            //             recent_msg: "hi",
            //             recent_msg_time: "16:00",
            //             not_read_messages: 3
            //         }
            //     ]
            // }


            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            console.log('AFTER VERIFIED:: ', getUserIdxResult);
            userIdx = getUserIdxResult.userIdx;

            let selectRoomInfoQuery = `
            SELECT room.idx, room.room_name, room_person.last_msg_idx, room.mem_count, room.member
            FROM room_person, room
            WHERE room_person.room_idx = room.idx and room_person.user_idx = ? ; `;

            // 방 인덱스, 방 제목, 마지막으로 읽은 메세지 인덱스, 멤버 수, 멤버 인덱스들
            let selectedRoomInfo = await db.queryParam_Parse(selectRoomInfoQuery, [userIdx]);
            for (var i = 0; i < selectedRoomInfo.length; i++) {
                let dataObject = {};
                dataObject.room_idx = selectedRoomInfo[i].idx;
                dataObject.room_name = selectedRoomInfo[i].room_name;
                dataObject.last_msg_idx = selectedRoomInfo[i].last_msg_idx;
                dataObject.mem_count = selectedRoomInfo[i].mem_count;
                dataObject.members = JSON.parse(selectedRoomInfo[i].member).members
                dataArray.push(dataObject);
            }

            // 안읽은 메세지 수 추가
            let countNotReadMsgQuery = `
            SELECT count(*) AS count
            FROM chatting
            WHERE room_idx = ? and idx > ? ` ;

            for (var idx = 0; idx < dataArray.length; idx++) {
                let countedNotReadMsg = await db.queryParam_Parse(countNotReadMsgQuery, [dataArray[idx].room_idx, dataArray[idx].last_msg_idx]);
                dataArray[idx].not_read_messages = countedNotReadMsg[0].count;
            }

            // 채팅방의 최근 메세지 시간, 메세지 내용, 레디스에 저장되어있는 인덱스 추가
            let selectRecentMsgQuery = `
            SELECT message, regist_dt
            FROM chatting
            WHERE room_idx = ? and idx > ? ORDER BY regist_dt DESC LIMIT 1` ; // 안읽은 메세지가 1개 이상일 경우

            let selectLastReadMsgQuery = `
            SELECT message, regist_dt
            FROM chatting
            WHERE room_idx = ? and idx = ?` ; // 안읽은 메세지가 하나도 없는 경우

            for (var idx = 0; idx < dataArray.length; idx++) {
                if (dataArray[idx].not_read_messages == 0) {
                    let selectedRecentMsg = await db.queryParam_Parse(selectLastReadMsgQuery, [dataArray[idx].room_idx, dataArray[idx].last_msg_idx]);
                    dataArray[idx].recent_msg = selectedRecentMsg[0].message;
                    dataArray[idx].recent_msg_time = moment(new Date(parseInt(selectedRecentMsg[0].regist_dt))).format("HH:mm");
                } else {
                    let selectedRecentMsg = await db.queryParam_Parse(selectRecentMsgQuery, [dataArray[idx].room_idx, dataArray[idx].last_msg_idx]);
                    dataArray[idx].recent_msg = selectedRecentMsg[0].message;
                    dataArray[idx].recent_msg_time = moment(new Date(parseInt(selectedRecentMsg[0].regist_dt))).format("HH:mm");
                }
            }

            console.log("DATA ARRAY :: ", dataArray);

            // 멤버들 프사 추가
            let selectMemPhotoQuery = `
            SELECT profile
            FROM user
            WHERE idx IN (?) ` ;

            for (var i = 0; i < dataArray.length; i++) {
                let selectedMemPhoto = await db.queryParam_Parse(selectMemPhotoQuery, [dataArray[i].members])
                let mem_profile = [];
                for (var user = 0; user < selectedMemPhoto.length; user++) {
                    mem_profile.push(JSON.parse(selectedMemPhoto[user].profile).profile_front);
                }
                dataArray[i].mem_profile = mem_profile;
            }


            console.log("지금까지 DATA ARRAY :: ", dataArray);

            resolve({
                code: 200,
                json: util.successTrue(statusCode.OK, "채팅방 목록 조회 성공", dataArray)
            });



            // 가장 최근 메세지 가져오기 -> zrange messages -1 -1
            // client.get('name', (err, reply) => {
            //     console.log(reply);
            // });


        });


    }
};