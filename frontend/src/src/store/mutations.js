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
    state.userNick = payload.data[0].userNick
    state.userIntro = payload.data[0].profileMessage
    state.userProfileFront = payload.data[0].profileFront
    state.userProfileBack = payload.data[0].profileBack

    VueCookies.set('accessToken', payload.data[0].accessToken, '15m')
    VueCookies.set('refreshToken', payload.data[0].refreshToken, '60m')

    if (payload.data[0].status === 1) router.push('/home')
    else router.push('/auth')
  },
  signInFail (state, payload) {
    console.log('signInFail')
  },
  authSuccess (state, payload) {
    router.push('/home')
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
  },
  getSendRequestListSuccess (state, payload) {
    state.sendRequestList = payload
  },
  getReceiveRequestListSuccess (state, payload) {
    state.receiveRequestList = payload
  },
  acceptRequestSuccess (state, payload) {
    state.receiveRequestList = payload
  },
  getHomeListSuccess (state, payload) {
    state.homeList = payload
  },
  getEmailSearchResultSuccess (state, payload) {
    state.searchResultList = payload
  },
  getIdSearchResultSuccess (state, payload) {
    state.searchResultList = payload
  },
  resetSearchResult (state, payload) {
    state.searchResultList = []
  },
  sendFriendRequestSuccess (state, payload) {

  },
  inviteFriendSuccess (state, payload) {

  },
  getFriendProfileDetailSuccess (state, payload) {
    state.friendProfileDetail = payload[0]
  },
  updateMyProfileSuccess (state, payload) {
    state.userIntro = payload.profile_message
    state.userNick = payload.user_nick
    state.userProfileFront = payload.profile_front
    state.userProfileBack = payload.profile_back
  },
  createRoomSuccess (state, payload) {
    state.room_idx = payload.data
  },
  setAccessTokenSuccess (state, payload) {
    state.setAccessToken = payload
  },
  goPrivateChatSuccess (state, payload) {
    state.room_idx = payload
  }
}
