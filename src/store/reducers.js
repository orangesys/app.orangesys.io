// @flow

import { reducer as messageReducer } from '../app/common/message'
import { reducer as errorReducer } from '../app/common/error'
import { reducer as userReducer } from '../app/common/user'
import { reducer as signUpReducer } from '../app/sign-up'
import { reducer as signInReducer } from '../app/sign-in'
import { reducer as emailActionReducer } from '../app/email-action'
import { reducer as resetPasswordReducer } from '../app/email-action/reset-password'
import { reducer as verificationGuideReducer } from '../app/verification-guide'
import { reducer as setupReducer } from '../app/setup'
import { reducer as serverSetupReducer } from '../app/server-setup'
import { reducer as inquiryReducer } from '../app/dashboard/inquiry'
import { reducer as planReducer } from '../app/dashboard/plan'
import { reducer as accountSettingsReducer } from '../app/settings/account'

const reducers = {
  message: messageReducer,
  error: errorReducer,
  user: userReducer,
  signUp: signUpReducer,
  signIn: signInReducer,
  emailAction: emailActionReducer,
  resetPassword: resetPasswordReducer,
  verificationGuide: verificationGuideReducer,
  setup: setupReducer,
  serverSetup: serverSetupReducer,
  inquiry: inquiryReducer,
  plan: planReducer,
  accountSettings: accountSettingsReducer,
}

export default reducers
