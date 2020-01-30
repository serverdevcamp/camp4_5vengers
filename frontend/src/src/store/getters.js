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
