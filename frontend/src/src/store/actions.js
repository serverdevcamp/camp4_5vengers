import axios from 'axios'
import router from '../router'

export const Actions = {
  signUp ({ commit }, payload) {
    axios.post('http://localhost:3000/user/signUp', payload).then(response => {
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
    axios.post('http://localhost:3000/user/signIn', payload).then(response => {
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
  sendMsg ({ commit }, payload) {
    console.log(payload)
    axios.post('http://localhost:3000/example', payload).then(response => {
      console.log('in')
      console.log(response.status)
      if (response.status === 200) commit('sendMsgSuccess', response.data)
      else commit('sendMsgFail', response.data)
    })
  }

}
