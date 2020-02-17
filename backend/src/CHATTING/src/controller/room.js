const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const resMessage = require('../module/responseMessage');
const db = require('../module/pool');
var moment = require('moment');

var room = 'offline 시간'
var room_on = 'online 시간'
var readCount = 'readCount'

module.exports = {
    //offline update
    updateOffline : (room_idx, user_idx, inRoomDetails) => {
        return new Promise(async(resolve, reject) => {
            console.log("유저 : ", user_idx)
            var offline = moment.now();
            const updateRoomQuery = 'UPDATE room_person SET offline_dt = ? WHERE user_idx = ? AND room_idx = ?';
            const updateRoomResult = await db.queryParam_Parse(updateRoomQuery ,[offline, user_idx, room_idx]);
            if(updateRoomResult.length == 0){
                resolve({
                    code : 200,
                    json : util.successFalse(statusCode.HOME_SHOW_FAIL, resMessage.X_UPDATE_FAIL(room))
                });
                return;
            }
            resolve({
                code : 200,
                json : util.successTrue(statusCode.HOME_SHOW_FAIL, resMessage.X_UPDATE_SUCCESS(room))
            });
            //last도 update해주기(같은 채팅방 안에서 자신의 offline_dt보다 regist_dt가 더 작은 메세지들 중에 가장 idx가 큰 값)

            if(inRoomDetails == 1){
                const selectLastQuery = 'SELECT MAX(idx) AS last_msg_idx FROM chatting WHERE regist_dt < ? AND room_idx = ?';
                const selectLastResult = await db.queryParam_Parse(selectLastQuery ,[offline, room_idx]);
                console.log(selectLastResult[0]['last_msg_idx']);
                const updateLastQuery = 'UPDATE room_person SET last_msg_idx = ? WHERE room_idx = ? AND user_idx = ?';
                const updateLastResult = await db.queryParam_Parse(updateLastQuery ,[selectLastResult[0]['last_msg_idx'], room_idx, user_idx]);                
            }
        });
    },
    updateOnline : (room_idx, user_idx) => {
        return new Promise(async(resolve, reject) => {
            console.log("유저 : ", user_idx)
            var offline = moment.now();
            const updateRoomQuery = 'UPDATE room_person SET online_dt = ? WHERE user_idx = ? AND room_idx = ?';
            const updateRoomResult = await db.queryParam_Parse(updateRoomQuery ,[offline, user_idx, room_idx]);
            if(updateRoomResult.length == 0){
                resolve({
                    code : 200,
                    json : util.successFalse(statusCode.HOME_SHOW_FAIL, resMessage.X_UPDATE_FAIL(room_on))
                });
                return;
            }
            resolve({
                code : 200,
                json : util.successTrue(statusCode.HOME_SHOW_FAIL, resMessage.X_UPDATE_SUCCESS(room_on))
            });
            return;
        });
    },
    getReadCount : (room_idx) => {
        return new Promise(async(resolve, reject) => {
            const selectCountQuery = 'SELECT regist_count FROM chatting WHERE room_idx = ?';
            const selectCountResult = await db.queryParam_Parse(selectCountQuery ,[room_idx]);
            if(selectCountResult.length == 0){
                resolve({
                    code : 200,
                    json : util.successFalse(statusCode.HOME_SHOW_FAIL, resMessage.X_READ_FAIL(readCount))
                });
                return;
            }
            var list = []
            for(i=0; i<selectCountResult.length; i++){
                list.push(selectCountResult[i]['regist_count']);
            }
            resolve({
                code : 200,
                json : util.successTrue(statusCode.HOME_SHOW_FAIL, resMessage.X_READ_SUCCESS(readCount), list)
            });
            return;
        });
    },
}