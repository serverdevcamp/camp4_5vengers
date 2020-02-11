import SignInPage from '@/components/SignIn'

export default {
  path: '/signIn',
  name: 'SignIn',
  component: SignInPage,
  meta: { unauthorized: true }
}
