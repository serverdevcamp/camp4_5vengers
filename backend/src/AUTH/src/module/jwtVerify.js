const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey');
const constants = require('../module/constants');

module.exports = {
    verifyAccessToken: ({ accessToken }) => {
        jwt.verify(accessToken, secretKey.access, (err,data) => {
            if(err){
              if(err.message === 'jwt expired'){
                return constants.ACCESS_EXP
              }
              else if(err.message === 'invalid token'){
                return constants.ACCESS_INV
              }
              else{
                console.log('ERR!!:: ',err.message);
              }
            }
            else{
                console.log('result:: ',data);
                return data
            }
          });
    },

    verifyRefreshToken: ({ refreshToken }) => {
        jwt.verify(refreshToken, secretKey.refresh, (err,data) => {
            if(err){
              if(err.message === 'jwt expired'){
                return constants.REFRESH_EXP
              }
              else if(err.message === 'invalid token'){
                return constants.REFRESH_INV
              }
              else{
                console.log('ERR!!:: ',err.message);
              }
            }
            else{
                console.log('result:: ',data);
                return data
            }
          });
    }
}