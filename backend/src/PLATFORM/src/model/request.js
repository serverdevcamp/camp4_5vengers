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
            WHERE friends_request.from = ? `;

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

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            // friends_request 테이블 업데이트
            let updateStatusQuery = `
            UPDATE friends_request 
            SET status = 1 
            WHERE friends_request.to = ? and friends_request.from = ? `;
            let updatedStatus = await db.queryParam_Parse(updateStatusQuery, [userIdx, from]);

            let selectFriendsQuery = `
            SELECT friends
            FROM user
            WHERE idx = ? `;

            let updateUserFriendsQuery = `
            UPDATE user 
            SET friends = ? 
            WHERE idx = ? `;

            // user 테이블의 friends 칼럼 가져와서 from 추가, friends 칼럼 업데이트
            let selectedFriendsTo = await db.queryParam_Parse(selectFriendsQuery, [userIdx]);
            let tempArray = [];
            tempArray = JSON.parse(selectedFriendsTo[0].friends).friends
            tempArray.push(parseInt(from))
            let toObject = {};
            toObject.friends = tempArray;
            let updatedUserFriendsTo = await db.queryParam_Parse(updateUserFriendsQuery, [JSON.stringify(toObject), userIdx]);

            // 상대방의 friends 칼럼도 업데이트
            let selectedFriendsFrom = await db.queryParam_Parse(selectFriendsQuery, [from]);
            let tempArray2 = [];
            tempArray2 = JSON.parse(selectedFriendsFrom[0].friends).friends;
            tempArray2.push(parseInt(userIdx));
            let fromObject = {};
            fromObject.friends = tempArray2;
            let updatedUserFriendsFrom = await db.queryParam_Parse(updateUserFriendsQuery, [JSON.stringify(fromObject), from])


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


    /*
     * status 0: 나
     *        1: 이미 친구
     *        2: 친구 아님
     *        3: 친구 아닌데 이미 요청 보냄 
    */
    friendList: ({ accessToken, input, by }) => {
        return new Promise(async (resolve, reject) => {
            let userIdx;
            let dataArray = []; // client에게 보내줄 data: []
            let dataObject = {};

            let friendsIdxArray = [];
            let sendedUserIdxArray = [];
            let isInFriendsIdxArray = false; // 친구인지 아닌지
            let isInSendedUserIdxArray = false; // 요청 보낸 사람인지 아닌지

            let getUserIdxResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserIdxResult.userIdx;

            // 해당 사용자의 친구들 인덱스 꺼내기
            let selectMyFriendsQuery = `
            SELECT friends
            FROM user 
            WHERE idx = ? `;
            let selectedMyFriends = await db.queryParam_Parse(selectMyFriendsQuery, [userIdx]);
            friendsIdxArray = JSON.parse(selectedMyFriends[0].friends).friends

            // 해당 사용자가 이미 요청 보낸 사람들 인덱스 꺼내기
            let selectSendedIdxQuery = `
            SELECT *
            FROM friends_request 
            WHERE friends_request.from = ? and friends_request.status = 0 `;
            let selectedSendedIdx = await db.queryParam_Parse(selectSendedIdxQuery, [userIdx]);
            for (var i in selectedSendedIdx) {
                sendedUserIdxArray.push(selectedSendedIdx[i].to)
            }

            let selectUserQuery;
            if (by == 'email') selectUserQuery = ` SELECT * FROM user WHERE email = ? `;
            else if (by == 'id') selectUserQuery = ` SELECT * FROM user WHERE id = ? `;
            let selectedUser = await db.queryParam_Parse(selectUserQuery, [input]);

            if (selectedUser.length == 0) {
                resolve({
                    code: 200,
                    json: util.successTrue(statusCode.OK, "친구 검색 성공", [])
                });
            }
            else {
                dataObject.user_idx = selectedUser[0].idx;
                dataObject.user_nick = selectedUser[0].nick;
                dataObject.profile_front = JSON.parse(selectedUser[0].profile).profile_front;
                dataObject.profile_message = JSON.parse(selectedUser[0].profile).profile_message;

                if (friendsIdxArray.length != 0) {
                    for (var idx in friendsIdxArray) {
                        if (dataObject.user_idx == friendsIdxArray[idx]) {
                            isInFriendsIdxArray = true;
                            break;
                        }
                        else continue;
                    }
                }

                if (sendedUserIdxArray.length != 0) {
                    for (var idx in sendedUserIdxArray) {
                        if (dataObject.user_idx == sendedUserIdxArray[idx]) {
                            isInSendedUserIdxArray = true;
                            break;
                        }
                        else continue;
                    }
                }

                if (dataObject.user_idx == userIdx) dataObject.status = 0;
                else {
                    if (isInFriendsIdxArray == true) dataObject.status = 1;
                    else {
                        if (isInSendedUserIdxArray == true) dataObject.status = 3;
                        else dataObject.status = 2;
                    }
                }

                dataArray.push(dataObject);

                resolve({
                    code: 200,
                    json: util.successTrue(statusCode.OK, "친구 검색 성공", dataArray)
                });
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
            let userName;
            let userIdx;
            let getUserInfoResult = await jwtVerify.verifyAccessToken(accessToken);
            userIdx = getUserInfoResult.userIdx;
            userName = getUserInfoResult.userName;

            let selectInviteQuery = `
            SELECT *
            FROM friends_invite
            WHERE friends_invite.email = ? and friends_invite.from = ?`;
            let selectedInvite = await db.queryParam_Parse(selectInviteQuery, [email, userIdx]);

            if (selectedInvite.length == 0) { // 초대한 적이 없다면 insert, 있으면 insert안하고 메일만 보내주기
                let insertInviteQuery = `
                INSERT INTO friends_invite
                VALUES(?,?,?) `;
                let insertedInvite = await db.queryParam_Parse(insertInviteQuery, [null, userIdx, email])
            }

            // 이메일 전송 옵션 설정
            let mailOptions = {
                from: secretEmail.user,
                to: email,
                subject: '안녕하세요, ' + userName + '님께서 5vengers에 초대했습니다!',
                html: '<p>5vengers에 가입하여 ' + userName + '님과 소통해보는건 어떨까요?</p>' + '<br>' + 'http://localhost:8081/signUp'
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