import router from '../router'

export const Mutations = {
  signUpSuccess (state, payload) {
    console.log('SignUpFinish!!')
  },
  signInSuccess (state, payload) {
    state.token = payload.result[0].token
    router.push('/todo')
  },
  signInFail (state, payload) {
    if (payload.status === 203) console.log('비밀번호 불일치')
    else if (payload.status === 204) console.log('해당하는 유저가 없습니다')
    else if (payload.status === 600) console.log('DB error')
    else if (payload.status === false) console.log('토큰 발행 에러')
  }
}
