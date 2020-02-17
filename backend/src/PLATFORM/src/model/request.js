const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const db = require('../module/pool.js');
const jwtVerify = require('../module/jwtVerify.js');
const moment = require('moment');
const _crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    // 보낸 요청 목록 조회
    sendList: ({ accessToken }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            let selectListQuery = `
            SELECT *
            FROM friends_request
            WHERE friends_request.from = ?`;

            let selectedList = await db.queryParam_Parse(selectListQuery, [userIdx]);
            for (var i = 0; i < selectedList.length; i++) {
                let dataObject = {};
                dataObject.idx = selectedList[i].idx;
                dataObject.receiver = selectedList[i].to;
                dataArray.push(dataObject);
            }

            let selectUserInfoQuery = `
            SELECT name, profile
            FROM user
            WHERE idx = ? `;
            for (var idx = 0; idx < dataArray.length; idx++) {
                let selectedUserInfo = await db.queryParam_Parse(selectUserInfoQuery, [dataArray[idx].receiver]);
                dataArray[idx].receiver_name = selectedUserInfo[0].name;
                dataArray[idx].receiver_profile = (JSON.parse(selectedUserInfo[0].profile)).profile_front;
            }
            console.log("RESULT::: ", dataArray);

            resolve({
                code: 200,
                json: util.successTrue(statusCode.OK, "보낸 요청 목록 조회 성공", dataArray)
            });

        });
    },

    // 받은 요청 목록 조회
    receiveList: ({ accessToken }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            let selectListQuery = `
            SELECT *
            FROM friends_request
            WHERE friends_request.to = ? and status = 0`;

            let selectedList = await db.queryParam_Parse(selectListQuery, [userIdx]);
            for (var i = 0; i < selectedList.length; i++) {
                let dataObject = {};
                dataObject.idx = selectedList[i].idx;
                dataObject.sender = selectedList[i].from;
                dataArray.push(dataObject);
            }

            let selectUserInfoQuery = `
            SELECT name, profile
            FROM user
            WHERE idx = ? `;
            for (var idx = 0; idx < dataArray.length; idx++) {
                let selectedUserInfo = await db.queryParam_Parse(selectUserInfoQuery, [dataArray[idx].sender]);
                dataArray[idx].sender_name = selectedUserInfo[0].name;
                dataArray[idx].sender_profile = (JSON.parse(selectedUserInfo[0].profile)).profile_front;
            }
            console.log("RESULT::: ", dataArray);

            resolve({
                code: 200,
                json: util.successTrue(statusCode.OK, "받은 요청 목록 조회 성공", dataArray)
            });

        });
    },

    // 수락 버튼 누를 시
    accept: ({ accessToken, from }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            let updateStatusQuery = `
            UPDATE friends_request 
            SET status = 1 
            WHERE friends_request.to = ? and friends_request.from = ? `;

            let updatedStatus = await db.queryParam_Parse(updateStatusQuery, [userIdx, from]);
            resolve({
                code: 200,
                json: util.successTrueNoData(statusCode.OK, "받은 요청 수락 성공")
            });



        });
    }
};