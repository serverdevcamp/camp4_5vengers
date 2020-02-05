import axios from 'axios'

export const Actions = {
  signUp ({ commit }, payload) {
    axios.post('http://localhost:3000/signup/', payload).then(response => {
      if (response.status === 201) {
        commit('signUpSuccess')
        location.reload('/')
        console.log('서버연결 중')
      }
    })
  },
  signIn ({ commit }, payload) {
    axios.post('http://localhost:3000/main/login', payload).then(response => {
      if (response.data.status === 200) commit('signInSuccess', response.data)
      else commit('signInFail', response.data)
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
