import VueCookies from 'vue-cookies'
import axios from 'axios'

export async function refreshToken () {
  try {
    const payload = {
      refreshToken: VueCookies.get('refreshToken')
    }
    const token = await axios.post('http://localhost:3000/user/reAccessToken', payload)
    VueCookies.set('accessToken', token.data.data[0].accessToken, '15m')
    this.$store.dispatch('setAccessToken', token.data.data[0].accessToken)
    console.log('RE TOKEN:: ', token)
    return token
  } catch (err) {
    return err
  }
}
