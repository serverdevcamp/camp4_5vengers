const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const db = require('../module/pool.js');
const jwtVerify = require('../module/jwtVerify.js');
const moment = require('moment');

module.exports = {
    // 친구 프로필 상세보기
    friendProfile: ({ accessToken, friendIdx }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            let selectFriendInfoQuery = `
            SELECT idx, nick, profile
            FROM user
            WHERE idx = ? `;
            let selectedFriendInfo = await db.queryParam_Parse(selectFriendInfoQuery, [friendIdx]);

            let friendInfo = {};
            friendInfo.user_idx = selectedFriendInfo[0].idx;
            friendInfo.user_nick = selectedFriendInfo[0].nick;
            friendInfo.profile_front = JSON.parse(selectedFriendInfo[0].profile).profile_front;
            friendInfo.profile_back = JSON.parse(selectedFriendInfo[0].profile).profile_back;
            friendInfo.profile_message = JSON.parse(selectedFriendInfo[0].profile).profile_message;

            dataArray.push(friendInfo);

            resolve({
                code: 200,
                json: util.successTrue(statusCode.OK, "친구 프로필 상세 조회 성공", dataArray)
            });
        });
    },
    updateMyProfile: ({ accessToken, nick, message, front, back }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            let updateMyInfoQuery = `
            UPDATE user
            SET nick = ? , profile = ?
            WHERE idx = ? `;

            let profileObject = {};
            profileObject.profile_front = front;
            profileObject.profile_back = back;
            profileObject.profile_message = message;

            let updatedMyInfo = await db.queryParam_Parse(updateMyInfoQuery, [nick, JSON.stringify(profileObject), userIdx]);

            let selectMyInfoQuery = `
            SELECT nick, profile
            FROM user
            WHERE idx = ? `;
            let selectedMyInfo = await db.queryParam_Parse(selectMyInfoQuery, [userIdx]);

            let myInfo = {};
            myInfo.user_nick = selectedMyInfo[0].nick;
            myInfo.profile_front = JSON.parse(selectedMyInfo[0].profile).profile_front;
            myInfo.profile_back = JSON.parse(selectedMyInfo[0].profile).profile_back;
            myInfo.profile_message = JSON.parse(selectedMyInfo[0].profile).profile_message;

            let dataArray = [];
            dataArray.push(myInfo);

            resolve({
                code: 200,
                json: util.successTrue(statusCode.OK, "내 프로필 수정 성공", myInfo)
            });
        });
    }
};