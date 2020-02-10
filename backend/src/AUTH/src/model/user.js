const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const db = require('../module/pool.js');
const _crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const secretKey = require('../config/secretKey');

const jwtVerify = require('../module/jwtVerify');
const constants = require('../module/constants');

const nodemailer = require('nodemailer');
const _redis = require('redis');
const secretEmail = require('../config/email');
const redisClient = _redis.createClient({
    host: "127.0.0.1",
    port: 6379 // redis 기본 포트번호
});

// nodemailer 설정
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: secretEmail.user,
        pass: secretEmail.pwd
    }
});

// access token 설정
let accessOption = {
    algorithm: "HS512",
    expiresIn: 3600 * 24 * 1 // 하루
}

// refresh token 설정
let refreshOption = {
    algorithm: "HS512",
    expiresIn: 3600 * 24 * 14 // 2주
}

// 이메일 인증코드 10자
function createKeyVerify() {
    var keyOne = _crypto.randomBytes(256).toString('hex').substr(100, 5);
    var keyTwo = _crypto.randomBytes(256).toString('base64').substr(50, 5);
    var keyVerify = keyOne + keyTwo;
    return keyVerify;
}


module.exports = {
    // 회원가입
    signUp: ({ id, name, email, pwd, nick }) => {
        return new Promise(async (resolve, reject) => {
            let selectUserQuery = `
            SELECT * 
            FROM user
            WHERE id = ? OR email = ? `;
            let values = [id, email];
            let selectUserResult = await db.queryParam_Parse(selectUserQuery, values);
            let tempProfile = {
                profile_front: "https://pngimage.net/wp-content/uploads/2018/06/user-image-png-5.png",
                profile_back: "https://i.pinimg.com/474x/e5/39/a0/e539a00e8324eba1bac132dae05152d5.jpg",
                profile_message: ""
            };

            if (selectUserResult.length != 0) {
                resolve({
                    code: 201,
                    json: util.successFalse(statusCode.USER_ALREADY_EXIST, "중복된 회원입니다.")
                });
                return;
            } else {
                let salt = _crypto.randomBytes(64).toString('base64');
                pwd = _crypto.pbkdf2Sync(pwd, salt, 420000, 32, 'sha512').toString('base64');

                let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                let verifyCode = createKeyVerify(); // 이메일 인증코드 생성

                let insertUserQuery =
                    `
                INSERT INTO user
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);
                `;
                let insertUserResult = await db.queryParam_Parse(insertUserQuery, [null, name, id, email, pwd, nick, salt, now, now, null, 0, JSON.stringify(tempProfile), null, verifyCode, null]);

                // 이메일 전송 옵션 설정
                let mailOptions = {
                    from: secretEmail.user,
                    to: email,
                    subject: '안녕하세요, 이메일 인증을 해주세요',
                    text: 'That was easy!',
                    html: '<p>아래의 코드를 앱에서 입력해주세요 !</p>' +
                        "<h1>" + verifyCode + "</h1>"
                };

                // 이메일 전송
                transporter.sendMail(mailOptions, function (err, res) {
                    if (err) console.log(err);
                    else console.log('email has been sent.');
                    transporter.close();
                });

                resolve({
                    code: 201,
                    json: util.successTrue(statusCode.CREATED, "회원가입 완료")
                });

            }

        });


    },

    // 로그인
    signIn: ({ id, pwd }) => {
        return new Promise(async (resolve, reject) => {
            let selectUserQuery = `
            SELECT *
            FROM user
            WHERE id = ? `;

            let comparePwdQuery = `
            SELECT *
            FROM user
            WHERE pwd = ? and id = ? `;

            let tempAccessToken, tempRefreshToken;

            let selectUserResult = await db.queryParam_Arr(selectUserQuery, [id]);
            if (selectUserResult.length == 0) {
                resolve({
                    code: 201,
                    json: util.successFalse(statusCode.USER_NOT_EXIST_USER, "존재하는 회원이 아닙니다.")
                });
                return;
            } else {
                pwd = _crypto.pbkdf2Sync(pwd, selectUserResult[0].salt, 420000, 32, 'sha512').toString('base64');
                let comparePwdResult = await db.queryParam_Arr(comparePwdQuery, [pwd, id]);

                if (comparePwdResult.length == 0) {
                    resolve({
                        code: 201,
                        json: util.successFalse(statusCode.USER_NOT_SAME_PW, "비밀번호가 일치하지 않습니다.")
                    });
                    return;
                } else {
                    let payload = {
                        id: id,
                        pwd: pwd
                    };
                    // access token 발행
                    jwt.sign(payload, secretKey.access, accessOption, (err, accessToken) => {
                        if (err) {
                            resolve({
                                code: 500,
                                json: util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR")
                            });
                            return;
                        } else {
                            tempAccessToken = accessToken;

                            // // redis에 유저 아이디-access token 저장
                            // redisClient.set(id, accessToken, function (err, data) {
                            //     if (err) {
                            //         console.log(err);
                            //         res.send("error " + err);
                            //         return;
                            //     } else {
                            //         redisClient.expire(id, 60 * 60 * 24 * 1); // 1일 뒤 만료
                            //     }
                            // });

                            // refresh token 발행
                            jwt.sign(payload, secretKey.refresh, refreshOption, (err, refreshToken) => {
                                if (err) {
                                    resolve({
                                        code: 500,
                                        json: util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR")
                                    });
                                    return;
                                } else {
                                    tempRefreshToken = refreshToken;
                                }
                            })
                        }
                    })
                    let updateRefreshTokenQuery = `
                    UPDATE user 
                    SET refresh_token = ?
                    WHERE id = ?`;

                    let updateRefreshTokenResult = await db.queryParam_Parse(updateRefreshTokenQuery, [tempRefreshToken, id]);
                    let resultArray = [];
                    let userInfo = {};

                    userInfo.accessToken = tempAccessToken;
                    userInfo.refreshToken = tempRefreshToken;
                    userInfo.status = comparePwdResult[0].status;
                    resultArray.push(userInfo);

                    resolve({
                        code: 200,
                        json: util.successTrue(statusCode.OK, "로그인 성공", resultArray)
                    });

                }

            }

        });
    },

    // access token 재발급
    reAccessToken: ({ id, refreshToken }) => {
        return new Promise(async (resolve, reject) => {
            let selectUserQuery = `
            SELECT *
            FROM user
            WHERE id = ? `;
            let selectUserResult = await db.queryParam_Arr(selectUserQuery, [id]);

            if (selectUserResult.length == 0) {
                resolve({
                    code: 201,
                    json: util.successFalse(statusCode.USER_NOT_EXIST_USER, "존재하는 회원이 아닙니다.")
                });
                return;
            } else {
                let checkRightTokenQuery = `
                SELECT *
                FROM user
                WHERE id = ? and refresh_token = ? `;
                let checkRightTokenResult = await db.queryParam_Parse(checkRightTokenQuery, [id, refreshToken]);
                if (checkRightTokenResult.length == 0) {
                    resolve({
                        code: 201,
                        json: util.successFalse(statusCode.TOKEN_NOT_SAME, "토큰이 일치하지 않습니다.")
                    });
                    return;
                } else {
                    // access token 발행
                    jwt.sign(payload, secretKey.access, accessOption, (err, accessToken) => {
                        if (err) {
                            resolve({
                                code: 500,
                                json: util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR")
                            });
                            return;
                        } else {

                            // redis에 유저 아이디-access token 저장
                            redisClient.set(id, accessToken, function (err, data) {
                                if (err) {
                                    console.log(err);
                                    res.send("error " + err);
                                    return;
                                } else {
                                    redisClient.expire(id, 60 * 60 * 24 * 1); // 1일 뒤 만료
                                }
                            });

                            let resultArray = [];
                            let userInfo = {};

                            userInfo.accessToken = accessToken;
                            resultArray.push(userInfo);

                            resolve({
                                code: 200,
                                json: util.successTrue(statusCode.OK, "ACCESS 토큰 재발급 성공", resultArray)
                            });


                        }
                    })
                }
            }
        });
    },

    // refresh token 재발급
    reRefreshToken: ({ id }) => {
        return new Promise(async (resolve, reject) => {
            let selectUserQuery = `
            SELECT *
            FROM user
            WHERE id = ? `;
            let selectUserResult = await db.queryParam_Arr(selectUserQuery, [id]);
            let tempRefreshToken;

            if (selectUserResult.length == 0) {
                resolve({
                    code: 201,
                    json: util.successFalse(statusCode.USER_NOT_EXIST_USER, "존재하는 회원이 아닙니다.")
                });
                return;
            } else {
                let selectTokenQuery = `
                SELECT refresh_token
                FROM user
                WHERE id = ?`;
                let selectTokenResult = await db.queryParam_Parse(selectTokenQuery, [id]);
                if (selectTokenResult.length != 0) {
                    resolve({
                        code: 201,
                        json: util.successFalse(statusCode.TOKEN_ALREADY_EXIST, "REFRESH 토큰이 이미 존재합니다.")
                    });
                    return;
                } else {
                    // refresh token 발행
                    jwt.sign(payload, secretKey.refresh, refreshOption, (err, refreshToken) => {
                        if (err) {
                            resolve({
                                code: 500,
                                json: util.successFalse(statusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR")
                            });
                            return;
                        } else {
                            tempRefreshToken = refreshToken;
                        }
                    })

                    let updateRefreshTokenQuery = `
                    UPDATE user 
                    SET refresh_token = ?
                    WHERE id = ?`;

                    let updateRefreshTokenResult = await db.queryParam_Parse(updateRefreshTokenQuery, [tempRefreshToken, id]);

                    let resultArray = [];
                    let userInfo = {};

                    userInfo.refreshToken = tempRefreshToken;
                    resultArray.push(userInfo);

                    resolve({
                        code: 200,
                        json: util.successTrue(statusCode.OK, "REFRESH 토큰 재발급 성공", resultArray)
                    });

                }
            }
        });
    },

    // 이메일 인증
    auth: ({ email, code }) => {
        return new Promise(async (resolve, reject) => {
            let selectUserQuery = `
            SELECT *
            FROM user
            WHERE email = ? `;
            let selectUserResult = await db.queryParam_Arr(selectUserQuery, [email]);
            if (selectUserResult.length == 0) {
                resolve({
                    code: 201,
                    json: util.successFalse(statusCode.USER_NOT_EXIST_USER, "존재하는 회원이 아닙니다.")
                });
                return;
            } else {
                if (code == selectUserResult[0].code) { // 입력한 코드와 일치하면
                    let updateStatusQuery = `
                    UPDATE user 
                    SET status = 1
                    WHERE email = ? `;

                    let updateStatusResult = await db.queryParam_Parse(updateStatusQuery, [email]);
                    resolve({
                        code: 200,
                        json: util.successTrueNoData(statusCode.OK, "이메일 인증 성공")
                    });
                } else {
                    resolve({
                        code: 201,
                        json: util.successFalse(statusCode.USER_NOT_SAME_CODE, "인증코드가 일치하지 않습니다.")
                    });
                }
            }
        });
    }
};