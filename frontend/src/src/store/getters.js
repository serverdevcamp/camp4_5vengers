export const Getters = {
}

export const userInfoGetters = {
  tokenInfo (state, getters) {
    return state.userToken
  },

  nickInfo (state, getters) {
    return state.userNick
  },
  introInfo (state, getters) {
    return state.userIntro
  },
  idxInfo (state, getters) {
    return state.userIdx
  },
  profileFrontInfo (state, getters) {
    return state.userProfileFront
  },
  profileBackInfo (state, getters) {
    return state.userProfileBack
  }
}

export const roomInfoGetters = {
  roomName (state, getters) {
    return state.room_name
  },

  memCount (state, getters) {
    return state.mem_count
  },

  roomIdx (state, getter) {
    return state.room_idx
  }
}

export const roomListGetters = {
  roomList (state, getters) {
    return state.roomList
  }
}

export const inRoomDetailsGetters = {
  inRoomDetails (state, getters) {
    return state.inRoomDetails
  }
}

export const friendListGetters = {
  friendList (state, getters) {
    return state.friendList
  },
  searchResultList (state, getters) {
    return state.searchResultList
  }
}

export const requestListGetters = {
  sendRequestList (state, getters) {
    return state.sendRequestList
  },
  receiveRequestList (state, getters) {
    return state.receiveRequestList
  }
}

export const homeListGetters = {
  homeList (state, getters) {
    return state.homeList
  }
}

export const profileDetailGetters = {
  friendProfileDetail (state, getters) {
    return state.friendProfileDetail
  },
  myProfileDetail (state, getters) {
    return state.myProfileDetail
  }
}
