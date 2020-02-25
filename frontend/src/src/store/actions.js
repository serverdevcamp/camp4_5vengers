import axios from 'axios'
import router from '../router'

export const Actions = {
  signUp ({ commit }, payload) {
    axios.post('http://13.125.153.37:3000/user/signUp', payload).then(response => {
      console.log('here actions')
      if (response.data.status === 201) {
        commit('signUpSuccess')
        router.push('/home')
      } else if (response.data.status === 330) {
        commit('signUpFail')
        location.href = '/signUp?result=330'
      }
    })
  },
  signIn ({ commit }, payload) {
    axios.post('http://13.125.153.37:3000/user/signIn', payload).then(response => {
      if (response.data.status === 200) {
        commit('signInSuccess', response.data)
      } else if (response.data.status === 336) {
        commit('signInFail')
        location.href = '/signIn?result=336'
      } else if (response.data.status === 331) {
        commit('signInFail')
        location.href = '/signIn?result=331'
      }
    })
  },
  auth ({ commit }, payload) {
    axios.post('http://13.125.153.37:3000/user/auth', payload).then(response => {
      if (response.data.status === 200) {
        commit('authSuccess')
      } else if (response.data.status === 336) {
        commit('authFail')
        location.href = '/auth?result=336'
      } else if (response.data.status === 333) {
        commit('authFail')
        location.href = '/auth?result=333'
      }
    })
  },
  home ({ commit }, payload) {
  },
  changeRoomIdx ({ commit }, payload) {
    console.log(payload)
    axios.post('http://localhost:3001/room/offline', payload).then(response => {
      console.log('in')
      if (response.status === 200) commit('changeRoomIdxSuccess', response.data)
      else commit('changeRoomIdxFail', response.data)
    })
  },
  changeOnlineIdx ({ commit }, payload) {
    console.log(payload)
    axios.post('http://localhost:3001/room/online', payload).then(response => {
      console.log('in_2')
      if (response.status === 200) commit('changeOnlineSuccess', response.data)
      else commit('changeOnlineFail', response.data)
    })
  },
  getRoomInfo ({ commit }, payload) {
    console.log(payload)
    axios.post('http://localhost:3001/chat/default', payload).then(response => {
      if (response.status === 200) commit('getRoomInfoSuccess', response.data)
      else commit('getRoomInfoFail', response.data)
    })
  },
  getRoomList ({ commit }, payload) {
    axios.post('http://localhost:3003/room/main', payload).then(response => {
      console.log('here get room list actions', response.data.data)
      commit('getRoomListSuccess', response.data.data)
    })
  },
  goRoomDetails ({ commit }, payload) {
    commit('goRoomDetails', payload)
  },
  inRoomDetails ({ commit }, payload) {
    commit('inRoomDetailsSuccess')
  },
  getFriendList ({ commit }, payload) {
    axios.post('http://localhost:3003/room/friendList', payload).then(response => {
      if (response.data.status === 200) {
        commit('getFriendListSuccess', response.data.data)
      }
    })
  },
  createRoom ({ commit }, payload) {
    axios.post('http://localhost:3003/room/create', payload).then(response => {
      if (response.data.status === 200) {
        commit('createRoomSuccess', response.data)
      }
    })
  },
  settings ({ commit }, payload) {
    axios.post('http://localhost:3001/room/name', payload).then(response => {
      console.log('응답~~~: ', response)
      if (response.status === 200) commit('settingsSuccess', response.data)
    })
  },
  getSendRequestList ({ commit }, payload) {
    axios.post('http://localhost:3003/request/sendList', payload).then(response => {
      if (response.data.status === 200) {
        commit('getSendRequestListSuccess', response.data.data)
      }
    })
  },
  getReceiveRequestList ({ commit }, payload) {
    axios.post('http://localhost:3003/request/receiveList', payload).then(response => {
      if (response.data.status === 200) {
        commit('getReceiveRequestListSuccess', response.data.data)
      }
    })
  },
  acceptRequest ({ commit }, payload) {
    axios.post('http://localhost:3003/request/accept', payload).then(response => {
      if (response.data.status === 200) {
        commit('acceptRequestSuccess', response.data.data)
      }
    })
  },
  getHomeList ({ commit }, payload) {
    axios.get('http://localhost:3003/home/main', {headers: {'accesstoken': payload.accessToken}}).then(response => {
      if (response.data.status === 200) {
        commit('getHomeListSuccess', response.data.data)
      }
    })
  },
  getEmailSearchResult ({ commit }, payload) {
    axios.post('http://localhost:3003/request/friendList/email', payload).then(response => {
      if (response.data.status === 200) {
        commit('getEmailSearchResultSuccess', response.data.data)
      }
    })
  },
  getIdSearchResult ({ commit }, payload) {
    axios.post('http://localhost:3003/request/friendList/id', payload).then(response => {
      if (response.data.status === 200) {
        commit('getIdSearchResultSuccess', response.data.data)
      }
    })
  },
  resetSearchResult ({ commit }, payload) {
    commit('resetSearchResult')
  },
  sendFriendRequest ({ commit }, payload) {
    axios.post('http://localhost:3003/request/send', payload).then(response => {
      if (response.data.status === 200) {
        commit('sendFriendRequestSuccess')
      }
    })
  },
  inviteFriend ({ commit }, payload) {
    axios.post('http://localhost:3003/request/invite', payload).then(response => {
      if (response.data.status === 200) {
        commit('inviteFriendSuccess')
      }
    })
  },
  getFriendProfileDetail ({ commit }, payload) {
    axios.post('http://localhost:3003/profile/friendProfile', payload.object, {
      headers: {
        'accesstoken': payload.accessToken
      }
    }).then(response => {
      if (response.data.status === 200) {
        commit('getFriendProfileDetailSuccess', response.data.data)
      }
    })
  },
  updateMyProfile ({ commit }, payload) {
    axios.post('http://localhost:3003/profile/updateMyProfile', payload).then(response => {
      if (response.data.status === 200) {
        commit('updateMyProfileSuccess', response.data.data)
      }
    })
  }
}
