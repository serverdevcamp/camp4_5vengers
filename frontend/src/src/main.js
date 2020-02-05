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
import io from 'socket.io-client'; 
var socket = io.connect('http://localhost:3000', {transports: ['websocket']});

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
  socket,
  components: { App },
  template: '<App/>',

  mounted: function() {
    socket.on('messages', function(message) {
        this.messages.push(message);
    }.bind(this));

    socket.on('member_add', function(member) {
        Vue.set(this.members, member.socket, member);
    }.bind(this));

    socket.on('member_delete', function(socket_id) {
        Vue.delete(this.members, socket_id);
    }.bind(this));

    socket.on('message_history', function(messages) {
        console.log(messages);
        this.messages = messages;
    }.bind(this));

    socket.on('member_history', function(members) {
        console.log(members);
        this.members = members;
    }.bind(this));

  }
})
