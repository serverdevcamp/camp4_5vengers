const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const db = require('../module/pool.js');
const jwtVerify = require('../module/jwtVerify.js');
const moment = require('moment');
const secretEmail = require('../config/email');
const nodemailer = require('nodemailer');

// nodemailer 설정
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: secretEmail.user,
        pass: secretEmail.pwd
    }
});
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
            let dataArray = []; // client에게 보내줄 data: []
            let tempArray = [];

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            // friends_request 테이블 업데이트
            let updateStatusQuery = `
            UPDATE friends_request 
            SET status = 1 
            WHERE friends_request.to = ? and friends_request.from = ? `;
            let updatedStatus = await db.queryParam_Parse(updateStatusQuery, [userIdx, from]);

            // user 테이블의 friends 칼럼 가져와서 from 추가
            let selectFriendsQuery = `
            SELECT friends
            FROM user
            WHERE idx = ? `;
            let selectedFriends = await db.queryParam_Parse(selectFriendsQuery, [userIdx]);
            tempArray = JSON.parse(selectedFriends[0].friends).friends
            tempArray.push(parseInt(from))
            let dataObject = {};
            dataObject.friends = tempArray;

            // user 테이블의 friends 칼럼 업데이트
            let updateUserFriendsQuery = `
            UPDATE user 
            SET friends = ? 
            WHERE idx = ? `;
            let updatedUserFriends = await db.queryParam_Parse(updateUserFriendsQuery, [JSON.stringify(dataObject), userIdx]);

            // 업데이트 된 받은 요청 리스트 보내주기
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
                json: util.successTrue(statusCode.OK, "받은 요청 수락 성공", dataArray)
            });
        });
    },

    friendList: ({ accessToken, input, by }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []
            let friendsIdxArray = [];

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            let selectUserQuery;
            if (by == 'email') selectUserQuery = ` SELECT * FROM user WHERE email = ? `;
            else if (by == 'id') selectUserQuery = ` SELECT * FROM user WHERE id = ? `;

            let selectMyFriendsQuery = `
            SELECT friends
            FROM user 
            WHERE idx = ? `;
            let selectedMyFriends = await db.queryParam_Parse(selectMyFriendsQuery, [userIdx]);
            friendsIdxArray = JSON.parse(selectedMyFriends[0].friends).friends

            let selectedUser = await db.queryParam_Parse(selectUserQuery, [input]);
            if (selectedUser.length == 0) {
                resolve({
                    code: 200,
                    json: util.successTrue(statusCode.OK, "친구 검색 성공", dataArray)
                });
            } else {
                // 검색 결과가 나일때
                if (selectedUser[0].idx == userIdx) {
                    let dataObject = {};
                    dataObject.user_idx = selectedUser[0].idx;
                    dataObject.status = 0;
                    dataObject.user_nick = selectedUser[0].nick;
                    dataObject.profile_front = JSON.parse(selectedUser[0].profile).profile_front;
                    dataObject.profile_message = JSON.parse(selectedUser[0].profile).profile_message;
                    dataArray.push(dataObject);

                    resolve({
                        code: 200,
                        json: util.successTrue(statusCode.OK, "친구 검색 성공", dataArray)
                    });

                }
                // 검색 결과가 이미 친구인지 체크
                else {
                    let dataObject = {};
                    dataObject.user_idx = selectedUser[0].idx;

                    if (friendsIdxArray.length == 0) dataObject.status = 2;
                    else {
                        for (var idx in friendsIdxArray) {
                            console.log('친구 인덱스: ', dataObject.user_idx);
                            console.log(friendsIdxArray[idx]);
                            if (dataObject.user_idx == friendsIdxArray[idx]) {
                                dataObject.status = 1;
                                break;
                            }
                            else if (idx == friendsIdxArray.length - 1) dataObject.status = 2;
                            else continue;
                        }
                    }

                    dataObject.user_nick = selectedUser[0].nick;
                    dataObject.user_id = selectedUser[0].id;
                    dataObject.user_email = selectedUser[0].email;
                    dataObject.profile_front = JSON.parse(selectedUser[0].profile).profile_front;
                    dataObject.profile_message = JSON.parse(selectedUser[0].profile).profile_message;
                    dataArray.push(dataObject);

                    resolve({
                        code: 200,
                        json: util.successTrue(statusCode.OK, "친구 검색 성공", dataArray)
                    });
                }

            }


        });
    },
    send: ({ accessToken, idx }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx, userName; // 사용자 인덱스, 이름
            let getUserInfoResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserInfoResult.userIdx;
            userName = getUserInfoResult.userName;

            let insertRequestQuery = `
            INSERT INTO friends_request
            VALUES(?,?,?,?) `;

            let insertedRequest = await db.queryParam_Parse(insertRequestQuery, [null, idx, userIdx, 0]);

            resolve({
                code: 200,
                json: util.successTrueNoData(statusCode.OK, "친구 요청 성공")
            });

        });
    },
    invite: ({ accessToken, email }) => {
        return new Promise(async (resolve, reject) => {            
            let userName; // 사용자 이름
            let getUserInfoResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserInfoResult.userIdx;
            userName = getUserInfoResult.userName;

            // 이메일 전송 옵션 설정
            let mailOptions = {
                from: secretEmail.user,
                to: email,
                subject: '안녕하세요, ' + userName + '님께서 5vengers에 초대했습니다!',
                html: '<p>5vengers에 가입하여 ' + userName + '님과 소통해보는건 어떨까요?</p>'
            };

            // 이메일 전송
            transporter.sendMail(mailOptions, function (err, res) {
                if (err) console.log(err);
                else console.log('email has been sent.');
                transporter.close();
            });

            resolve({
                code: 200,
                json: util.successTrueNoData(statusCode.OK, "초대 이메일 전송 성공")
            });
        });
    }
};