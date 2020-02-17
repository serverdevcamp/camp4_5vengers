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
    // 보낸 요청 목록 조회
    sendList: ({ accessToken }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []

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

            // 채팅방의 최근 메세지 시간, 메세지 내용 추가
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
                    if (selectedRecentMsg.length == 0) { // 채팅방이 막 개설됐을 경우, 아무것도 없음
                        dataArray[idx].recent_msg = '';
                        dataArray[idx].recent_msg_time = '';
                    } else {
                        dataArray[idx].recent_msg = selectedRecentMsg[0].message;
                        dataArray[idx].recent_msg_time = moment(new Date(parseInt(selectedRecentMsg[0].regist_dt))).format("HH:mm");
                    }
                   
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