// @flow

import Router from '../lib/router'
import type { UserStatus } from '../lib/router'

import SignIn from './sign-in'
import SignUp from './sign-up'
import VerificationGuide from './verification-guide'
import Home from './home'
import EmailAction, { VerifyEmail, RecoverEmail, ResetPassword } from './email-action'
import * as Setup from './setup'
import ServerSetup from './server-setup'
import Graph from './dashboard/graph'
import DB from './dashboard/db'
import Inquiry from './dashboard/inquiry'
import Plan from './dashboard/plan'
import Settings from './settings'

const router = new Router()


const redirectPathIfDeniedOnNormalPage = (
    { loggedIn, emailVerified, planSelected, serverSetupCompleted }: UserStatus
): ?string => {
  if (!loggedIn) { return '/sign-in' }
  if (!emailVerified) { return '/verification-guide' }
  if (!planSelected) { return '/setup/plan' }
  if (!serverSetupCompleted) { return '/server-setup' }
  return null
}

const accessibleOnNormalPage = (
  { loggedIn, emailVerified, planSelected, serverSetupCompleted }: UserStatus
) =>
  (loggedIn && emailVerified && planSelected && serverSetupCompleted)

router.add('/sign-in', {
  title: 'ログイン',
  TargetComponent: SignIn,
  accessible: ({ loggedIn }: UserStatus) => !loggedIn,
  redirectPathIfDenied: '/',
})

router.add('/sign-up', {
  TargetComponent: SignUp,
  accessible: ({ loggedIn }: UserStatus) => !loggedIn,
  redirectPathIfDenied: '/',
})

router.add('/', {
  title: 'ホーム',
  TargetComponent: Home,
  accessible: ({ loggedIn, emailVerified, planSelected, serverSetupCompleted }: UserStatus) =>
    (loggedIn && emailVerified && planSelected && serverSetupCompleted),
  redirectPathIfDenied: (
      { loggedIn, emailVerified, planSelected, serverSetupCompleted }: UserStatus
  ): ?string => {
    if (!loggedIn) { return '/sign-in' }
    if (!emailVerified) { return '/verification-guide' }
    if (!planSelected) { return '/setup/plan' }
    if (!serverSetupCompleted) { return '/server-setup' }
    return null
  },
})

router.add('/verification-guide', {
  title: 'メールアドレスの認証',
  TargetComponent: VerificationGuide,
  accessible: ({ loggedIn, emailVerified }: UserStatus) => (loggedIn && !emailVerified),
  redirectPathIfDenied: ({ loggedIn, emailVerified }: UserStatus): ?string => {
    if (!loggedIn) { return '/sign-in' }
    if (emailVerified) { return '/' }
    return null
  },
})

router.add('/email-action', {
  TargetComponent: EmailAction,
  accessible: () => (true),
})

router.add('/verify-email', {
  title: 'メールアドレスの認証',
  TargetComponent: VerifyEmail,
  accessible: ({ loggedIn }: UserStatus) => (loggedIn),
  redirectPathIfDenied: '/sign-in',
})

router.add('/recover-email', {
  title: 'メールアドレスの変更取り消し',
  TargetComponent: RecoverEmail,
  accessible: ({ loggedIn }: UserStatus) => (loggedIn),
  redirectPathIfDenied: '/sign-in',
})

router.add('/reset-password', {
  title: 'パスワードの再設定',
  TargetComponent: ResetPassword,
  accessible: () => (true),
})

router.add('/setup/plan', {
  title: 'プランの選択',
  TargetComponent: Setup.Plan,
  accessible: ({ loggedIn, emailVerified, planSelected }: UserStatus) =>
    (loggedIn && emailVerified && !planSelected),
  redirectPathIfDenied: ({ loggedIn, emailVerified, planSelected }: UserStatus): ?string => {
    if (!loggedIn) { return '/sign-in' }
    if (!emailVerified) { return '/' }
    if (planSelected) { return '/' }
    return null
  },
})

router.add('/setup/payment', {
  title: '支払情報の入力',
  TargetComponent: Setup.Payment,
  accessible: ({ loggedIn, emailVerified, planSelected }: UserStatus) =>
    (loggedIn && emailVerified && !planSelected),
  redirectPathIfDenied: ({ loggedIn, emailVerified, planSelected }: UserStatus): ?string => {
    if (!loggedIn) { return '/sign-in' }
    if (!emailVerified) { return '/' }
    if (planSelected) { return '/' }
    return null
  },
})

router.add('/server-setup', {
  title: 'サーバーセットアップ',
  TargetComponent: ServerSetup,
  accessible: ({ loggedIn, emailVerified, planSelected, serverSetupCompleted }: UserStatus) =>
    (loggedIn && emailVerified && planSelected && !serverSetupCompleted),
  redirectPathIfDenied: ({
      loggedIn, emailVerified, planSelected, serverSetupCompleted,
    }: UserStatus) => {
    if (!loggedIn) { return '/sign-in' }
    if (!emailVerified || !planSelected || serverSetupCompleted) { return '/' }
    return null
  },
})

router.add('/graph', {
  title: 'Graph',
  TargetComponent: Graph,
  accessible: accessibleOnNormalPage,
  redirectPathIfDenied: redirectPathIfDeniedOnNormalPage,
})

router.add('/db', {
  title: 'InfluxDB',
  TargetComponent: DB,
  accessible: accessibleOnNormalPage,
  redirectPathIfDenied: redirectPathIfDeniedOnNormalPage,
})

router.add('/inquiry', {
  title: 'お問い合わせ',
  TargetComponent: Inquiry,
  accessible: accessibleOnNormalPage,
  redirectPathIfDenied: redirectPathIfDeniedOnNormalPage,
})

router.add('/plan', {
  title: 'プラン情報',
  TargetComponent: Plan,
  accessible: accessibleOnNormalPage,
  redirectPathIfDenied: redirectPathIfDeniedOnNormalPage,
})

router.add('/settings', {
  title: 'アカウント設定',
  TargetComponent: Settings,
  accessible: accessibleOnNormalPage,
  redirectPathIfDenied: redirectPathIfDeniedOnNormalPage,
})

// use router as singleton instance
export default router
