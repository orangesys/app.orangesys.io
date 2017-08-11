// @flow
import * as Stripe from '../../../core/stripe'
import { User, UserService } from '../../../core'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../../common/error'
import { ACTION_TYPES as MESSAGE_ACTION_TYPES } from '../../common/message'


export default class Actions {
  dispatch: (action: any) => any
  stripeRequester: Stripe.Requester
  userService: UserService

  constructor(
    dispatch: (action: any) => any,
    stripeRequester: Stripe.Requester,
    userService: UserService,
  ) {
    this.dispatch = dispatch
    this.stripeRequester = stripeRequester
    this.userService = userService
  }

  async changeCreditCard(form: any, user: User) {
    let token
    try {
      token = await Stripe.createToken(form)
      await this.stripeRequester.changeCredictCard(token, user.getCustomerId())
      this.dispatch({
        type: MESSAGE_ACTION_TYPES.SET,
        message: 'クレジットカード情報を更新しました',
      })
      return true
    } catch (error) {
      this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error })
      return false
    }
  }
}
