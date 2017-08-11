// @flow
import * as Stripe from '../../../core/stripe'
import { User, UserService } from '../../../core'
import type { PlanId } from '../../../core'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../../common/error'
import { ACTION_TYPES as USER_ACTION_TYPES } from '../../common/user'

export const REGISTER_PAYMENT = 'setup/register-payment'
export const REGISTER_PAYMENT_SUCCESS = 'setup/register-payment-success'
export const REGISTER_PAYMENT_FINISH = 'setup/register-payment-finish'


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

  async registerPayment(form: any, planId: PlanId, user: User): Promise<boolean> {
    this.dispatch({ type: REGISTER_PAYMENT })
    let token
    try {
      token = await Stripe.createToken(form)
      const { customerId, subscriptionId } =
        await this.stripeRequester.registerCustomer(token, planId, user.getId(), user.getEmail())
      const updatedUser = await this.userService.savePaymentInformation(
        user.getId(), planId, customerId, subscriptionId)
      this.dispatch({ type: USER_ACTION_TYPES.SET, user: updatedUser })
      return true
    } catch (error) {
      this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error })
      return false
    } finally {
      this.dispatch({ type: REGISTER_PAYMENT_FINISH })
    }
  }
}
