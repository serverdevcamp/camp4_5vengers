// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import { store } from './store/store'
import Vuetify from 'vuetify'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuetify/dist/vuetify.min.css'

// import vueResource from 'vue-resource'

// Vue.use(vueResource)
Vue.use(Vuetify)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  vuetify: new Vuetify(),
  store,
  components: { App },
  template: '<App/>'
})
