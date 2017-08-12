// @flow
import { User } from '../../core'
import type { RouterProp } from '../../lib/router'

type Props = {
  router: RouterProp,
  user: User,
}

const EmailAction = (props: Props) => {
  const { router, user } = props
  const mapping = {
    verifyEmail: '/verify-email',
    recoverEmail: '/recover-email',
    resetPassword: '/reset-password',
  }
  const redirectPath = mapping[router.query.mode]
  if (redirectPath == null) {
    router.redirectTo('/')
    return null
  }
  if (redirectPath === 'verifyEmail' || redirectPath === 'reset-password') {
    if (!user.loggedIn) {
      router.redirectTo('/sign-in')
      return null
    }
  }

  router.redirectTo(redirectPath, router.query)
  return null
}

export default EmailAction
