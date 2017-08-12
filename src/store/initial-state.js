// @flow

import { User } from '../core'
import type { ErrorState } from '../app/common/error'
import type { UserState } from '../app/common/user'
import type { SignUpState } from '../app/sign-up'
import type { SignInState } from '../app/sign-in'
import type { VerificationGuideState } from '../app/verification-guide'
import type { SetupState } from '../app/setup'
import type { ServerSetupState } from '../app/server-setup'
import type { InquiryState } from '../app/dashboard/inquiry'
import type { PlanState } from '../app/dashboard/plan'
import type { AccountSettingsState } from '../app/settings/account'
import type { EmailActionState } from '../app/email-action'
import type { ResetPasswordState } from '../app/email-action/reset-password'

type InitialState = {
  error: ErrorState,
  user: UserState,
  signUp: SignUpState,
  signIn: SignInState,
  verificationGuide: VerificationGuideState,
  emailAction: EmailActionState,
  resetPassword: ResetPasswordState,
  setup: SetupState,
  serverSetup: ServerSetupState,
  inquiry: InquiryState,
  plan: PlanState,
  accountSettings: AccountSettingsState,
}

const initialState: InitialState = {
  message: {
    message: null,
  },
  error: {
    code: null,
    message: null,
    error: null,
  },
  user: new User(),
  signUp: {
    providerId: null,
    submitting: false,
    signingUpWithOAuth: false,
  },
  signIn: {
    submitting: false,
  },
  emailAction: {
    status: 'WAITING',
  },
  resetPassword: {
    status: 'WAITING',
    email: null,
  },
  verificationGuide: {
    submitting: false,
  },
  setup: {
    planId: null,
    submitting: false,
  },
  serverSetup: {
    errorCode: null,
  },
  inquiry: {
    submitting: false,
  },
  plan: {
    fetching: false,
    storageUsage: null,
  },
  accountSettings: {
    submitting: false,
  },
}

export default initialState
