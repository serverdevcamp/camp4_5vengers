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
  }
}

export const roomInfoGetters = {
  roomName (state, getters) {
    return state.room_name
  },

  memCount (state, getters) {
    return state.mem_count
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
  }
}
