import router from '../router'
import VueCookies from 'vue-cookies'

export const Mutations = {
  signUpSuccess (state, payload) {
    console.log('signUpSuccess')
  },
  signUpFail (state, payload) {
    console.log('signUpFail')
  },
  signInSuccess (state, payload) {
    console.log('signInSuccess')
    state.userIdx = payload.data[0].userIdx
    state.userToken = payload.data[0].accessToken

    VueCookies.set('accessToken', payload.data[0].accessToken, '1d')
    VueCookies.set('refreshToken', payload.data[0].refreshToken, '2d')

    if (payload.data[0].status === 1) router.push('/home')
    else router.push('/auth')
  },
  signInFail (state, payload) {
    console.log('signInFail')
  },
  authSuccess (state, payload) {
    router.push('/home')
  },
  sendMsgSuccess (state, payload) {
    console.log(state)
    console.log(payload)
    console.log('sendMsgSuccess!!')
  },
  sendMsgFail (state, payload) {
    console.log(state)
    console.log(payload)
    console.log('sendMsgFail!!')
  },
  changeRoomIdxSuccess (state, payload) {
    state.inRoomDetails = 0
    console.log(payload)
  },
  changeRoomIdxFail (state, payload) {
    console.log(payload)
  },
  changeOnlineSuccess (state, payload) {
    console.log(payload)
  },
  changeOnlineFail (state, payload) {
    console.log(payload)
  },
  getRoomInfoSuccess (state, payload) {
    console.log(payload.data)
    var data = payload.data
    console.log('data 1:: ', data.roomName)
    console.log('data 2:: ', data.memCount)

    state.room_name = data.roomName
    state.mem_count = data.memCount
  },
  getRoomInfoFail (state, payload) {
    console.log(payload)
  },
  getRoomListSuccess (state, payload) {
    state.roomList = payload
    console.log('here get room list mutations')
  },
  goRoomDetails (state, payload) {
    state.room_idx = payload.roomIdx
    console.log('STORE ROOM IDX:: ', state.room_idx)
    console.log('STORE USER IDX:: ', state.userIdx)
  },
  readCountSuccess (state, payload) {
    console.log('readCoount: ', payload)
    // var data = payload.data
  },
  readCountFail (state, payload) {
    console.log(payload)
  },
  inRoomDetailsSuccess (state, payload) {
    state.inRoomDetails = 1
  },
  getFriendListSuccess (state, payload) {
    state.friendList = payload
  },
  settingsSuccess (state, payload) {
    console.log('수정한 방 이름 : ', payload)
    state.room_name = payload.room_name
  }
}
