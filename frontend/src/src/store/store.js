import Vue from 'vue'
import Vuex from 'vuex'
import { Getters, tokenGetters } from './getters.js'
import { Mutations } from './mutations.js'
import { Actions } from './actions.js'
import * as Cookies from 'js-cookie'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    userId: '',
    userPwd: '',
    userToken: ''
  },
  mutations: Object.assign({}, Mutations),
  getters: Object.assign({}, Getters, tokenGetters),
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
