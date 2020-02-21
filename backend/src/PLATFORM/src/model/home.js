const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const db = require('../module/pool.js');
const jwtVerify = require('../module/jwtVerify.js');
const moment = require('moment');

module.exports = {
    // 홈 친구 목록 조회
    main: ({ accessToken }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []
            let friendsIdxArray = [];

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            let selectFriendsQuery = `
            SELECT friends
            FROM user
            WHERE idx = ? `;

            let selectedFriends = await db.queryParam_Parse(selectFriendsQuery, [userIdx]);

            if (JSON.parse(selectedFriends[0].friends).friends.length == 0) {
                resolve({
                    code: 200,
                    json: util.successTrue(statusCode.OK, "홈 친구 목록 조회 성공", [])
                });
            } else {
                friendsIdxArray = JSON.parse(selectedFriends[0].friends).friends;

                let selectFriendInfoQuery = `
                SELECT idx, nick, profile
                FROM user
                WHERE idx IN (?)
                ORDER BY nick `;

                let selectedFriendInfo = await db.queryParam_Parse(selectFriendInfoQuery, [friendsIdxArray])

                for (var i = 0; i < selectedFriendInfo.length; i++) {
                    let dataObject = {};
                    dataObject.user_idx = selectedFriendInfo[i].idx;
                    dataObject.user_nick = selectedFriendInfo[i].nick;
                    dataObject.profile_front = JSON.parse(selectedFriendInfo[i].profile).profile_front;
                    dataObject.profile_back = JSON.parse(selectedFriendInfo[i].profile).profile_back;
                    dataObject.profile_message = JSON.parse(selectedFriendInfo[i].profile).profile_message;

                    dataArray.push(dataObject);

                    if (selectedFriendInfo.length == 0) break;
                }

                resolve({
                    code: 200,
                    json: util.successTrue(statusCode.OK, "홈 친구 목록 조회 성공", dataArray)
                });
            }


        });
    },

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

            console.log('data:: ', dataArray);

            resolve({
                code: 200,
                json: util.successTrue(statusCode.OK, "친구 프로필 상세 조회 성공", dataArray)
            });
        });
    }
};