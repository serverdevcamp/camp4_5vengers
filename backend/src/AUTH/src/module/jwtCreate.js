const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey');
const constants = require('../module/constants');
const statusCode = require('../module/statusCode');
const util = require('../module/utils');

// access token 설정
let accessOption = {
    algorithm: "HS512",
    expiresIn: 60 * 1 // 1분
}

// refresh token 설정
let refreshOption = {
    algorithm: "HS512",
    expiresIn: 3600 * 24 * 1 // 1일
}

module.exports = {
    // access token 발행
    createAccessToken: async (payload) => {
        let result;
        try {
            result = await jwt.sign(payload, secretKey.access, accessOption);
            return result;
        } catch (err) {
            next(err);
        } finally {
            return result;
        }

    },

    // refresh token 발행
    createRefreshToken: async (payload) => {
        let result;
        try {
            result = await jwt.sign(payload, secretKey.refresh, refreshOption);
            return result;
        } catch (err) {
            next(err);
        } finally {
            return result;
        }

    }
}