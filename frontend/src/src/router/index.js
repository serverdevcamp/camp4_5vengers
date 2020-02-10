import Vue from 'vue'
import Router from 'vue-router'

import SignInRoutes from './signIn'
import SignUpRoutes from './signUp'
import HomeRoutes from './home'
import RoomRoutes from './room'
import RoomDetailsRoutes from './roomDetails'
import AuthRoutes from './auth'

Vue.use(Router)

// export default new Router({
//   mode: 'history',
//   routes: [
//     SignInRoutes,
//     SignUpRoutes,
//     HomeRoutes,
//     RoomRoutes,
//     RoomDetailsRoutes,
//     AuthRoutes
//   ]
// })

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
// router.beforeEach(async (to, from, next) => {
//   if (VueCookies.get('token') === null && VueCookies.get('refresh_token') !== null) {
//     await refreshToken()
//   }

// if (to.matched.some(record => record.meta.unauthorized) || VueCookies.get('token')) {
//   return next()
// }

//   alert('로그인 해주세요')
//   return next('/login')
// })
export default router
