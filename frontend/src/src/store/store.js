import Vue from 'vue'
import Vuex from 'vuex'
import { Getters, userInfoGetters, roomInfoGetters, roomListGetters, inRoomDetailsGetters, friendListGetters, requestListGetters, homeListGetters, profileDetailGetters } from './getters.js'
import { Mutations } from './mutations.js'
import { Actions } from './actions.js'
import * as Cookies from 'js-cookie'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userIdx: '',
    userId: '',
    userEmail: '',
    userPwd: '',
    userName: '',
    userNick: '',
    userToken: '',
    userIntro: '',
    userProfileFront: '',
    userProfileBack: '',
    room_idx: '',
    room_name: '',
    mem_count: '',
    roomList: [],
    readCount: [8],
    inRoomDetails: 0,
    freindList: [],
    sendRequestList: [],
    receiveRequestList: [],
    homeList: [],
    searchResultList: [],
    searchEnterPressed: false,
    friendProfileDetail: {},
    myProfileDetail: {}
  },
  mutations: Object.assign({}, Mutations),
  getters: Object.assign({}, Getters, userInfoGetters, roomInfoGetters, roomListGetters, inRoomDetailsGetters, friendListGetters, requestListGetters, homeListGetters, profileDetailGetters),
  actions: Object.assign({}, Actions),
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 3 }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ]
})
