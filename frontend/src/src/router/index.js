import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'

import SignInRoutes from './signIn'
import SignUpRoutes from './signUp'
import HomeRoutes from './home'
import RoomRoutes from './room'
import RoomDetailsRoutes from './roomDetails'
import AuthRoutes from './auth'

import { refreshToken } from '../service/refreshToken'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    SignInRoutes,
    SignUpRoutes,
    HomeRoutes,
    RoomRoutes,
    RoomDetailsRoutes,
    AuthRoutes
  ]
})
router.beforeEach(async (to, from, next) => {
  console.log('ACCESS TOKEN:: ', VueCookies.get('accessToken'))
  console.log('REFRESH TOKEN:: ', VueCookies.get('refreshToken'))

  // 1. 쿠키에 액세스 토큰 값 없음 + 리프레시 토큰 값 있음 -> 액세스 토큰 재발급
  if (VueCookies.get('accessToken') === null && VueCookies.get('refreshToken') !== null) {
    await refreshToken()
  }

  // 2. 쿠키에 토큰값 있거나 unauthorized가 참일 경우 -> 다음 페이지로 이동 OK!!
  if (to.matched.some(record => record.meta.unauthorized) || VueCookies.get('accessToken')) {
    return next()
  }

  // 3. 토큰 값 없음 + 리프레시 토큰 값 없음 -> 다시 로그인
  alert('세션 만료. 다시 로그인 해주세요.')
  return next('/signIn')
})
export default router
