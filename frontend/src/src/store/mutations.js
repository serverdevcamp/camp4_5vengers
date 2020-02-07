import router from '../router'

export const Mutations = {
  signUpSuccess (state, payload) {
    console.log('signUpSuccess')
  },
  signUpFail (state, payload) {
    console.log('signUpFail')
  },
  signInSuccess (state, payload) {
    console.log('signInSuccess')
    state.token = payload.data[0].token
    router.push('/home')
  },
  signInFail (state, payload) {
    console.log('signInFail')
  },
  sendMsgSuccess (state, payload) {
    console.log(state)
    console.log(payload)
    console.log('sendMsgSuccess!!')
  },
  sendMsgFail (state, payload) {
    console.log(state)
    console.log(payload)
    console.log('sendMsgFail!!')
  }
}
