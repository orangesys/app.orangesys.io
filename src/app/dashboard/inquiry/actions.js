// @flow
import { delay } from 'awaiting'
import { InquiryRepository } from '../../../core'
import { ACTION_TYPES as MESSAGE_ACTION_TYPES } from '../../common/message'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../../common/error'

export const SEND: string = 'inquiery/send'
export const SEND_FINISH: string = 'sign-in/send-finish'

export default class Action {
  dispatch: (action: any) => any
  repository: InquiryRepository

  constructor(
    dispatch: (action: any) => any,
    repository: InquiryRepository,
  ) {
    this.dispatch = dispatch
    this.repository = repository
  }

  async sendInquiry(uid: string, body: string): Promise<boolean> {
    this.dispatch({ type: SEND })
    try {
      await delay(2000)
      await this.repository.addInquiry(uid, body)
      const message = 'お問い合わせ内容が送信されました。運営よりご連絡させて頂きます。'
      this.dispatch({ type: MESSAGE_ACTION_TYPES.SET, message })
    } catch (e) {
      this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error: e })
      return false
    } finally {
      this.dispatch({ type: SEND_FINISH })
    }
    return true
  }
}
