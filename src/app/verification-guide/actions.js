// @flow

import { User } from '../../core'
import { ACTION_TYPES as MESSAGE_ACTION_TYPES } from '../common/message'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../common/error'

export const RESEND_VERIFICATION_MAIL = 'verification-guide/resend-verification-mail'
export const RESEND_VERIFICATION_MAIL_FINISH = 'verification-guide/resend-verification-mail-finish'

export default class ActionDispatcher {
  dispatch: (action: any) => any
  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  async resendVerificationMail(user: User) {
    this.dispatch({ type: RESEND_VERIFICATION_MAIL })
    try {
      await user.sendEmailVerification()
      this.dispatch({
        type: MESSAGE_ACTION_TYPES.SET,
        message: '確認メールを再送信しました',
      })
    } catch (e) {
      this.dispatch({
        type: ERROR_ACTION_TYPES.SET_ERROR,
        error: e,
      })
    } finally {
      this.dispatch({
        type: RESEND_VERIFICATION_MAIL_FINISH,
      })
    }
  }
}
