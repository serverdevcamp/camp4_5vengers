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
