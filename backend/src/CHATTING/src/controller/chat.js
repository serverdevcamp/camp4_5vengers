const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const resMessage = require('../module/responseMessage');
const db = require('../module/pool');
var moment = require('moment');

var RoomInfo = '채팅'

module.exports = {
    chatRoomInfo : (room_idx) => {
        return new Promise(async(resolve, reject) => {
            const getRoomInfoQuery = 'SELECT room_name, mem_count FROM room WHERE idx = ?'
            // const updateRoomQuery = 'UPDATE room_person SET offline_dt = ? WHERE user_idx = ? AND room_idx = ?';
            // const updateRoomResult = await db.queryParam_Parse(updateRoomQuery ,[offline, user_idx, room_idx]);
            const getRoomInfoResult = await db.queryParam_Parse(getRoomInfoQuery ,[room_idx]);
            if(getRoomInfoResult.length == 0){
                resolve({
                    code : 200,
                    json : util.successFalse(statusCode.HOME_SHOW_FAIL, resMessage.X_READ_FAIL(RoomInfo))
                });
                return;
            }
            var object = ({
                roomName : getRoomInfoResult[0]['room_name'],
                memCount : getRoomInfoResult[0]['mem_count']
            })
            resolve({
                code : 200,
                json : util.successTrue(statusCode.HOME_SHOW_FAIL, resMessage.X_READ_SUCCESS(RoomInfo), object)
            });
            return;
        });
    },

}