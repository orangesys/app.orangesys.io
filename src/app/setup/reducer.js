// @flow

import * as PLAN_ACTION_TYPES from './plan/actions'
import * as PAYMENT_ACTION_TYPES from './payment/actions'
import type { PlanId } from '../../core'


export type State = {
  planId: PlanId | null,
  submitting: boolean,
}

type Action = {
  type: string,
  planId: PlanId,
}


const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case PLAN_ACTION_TYPES.SELECT_PLAN: {
      return { ...state, planId: action.planId }
    }
    case PAYMENT_ACTION_TYPES.REGISTER_PAYMENT: {
      return { ...state, submitting: true }
    }
    case PAYMENT_ACTION_TYPES.REGISTER_PAYMENT_FINISH: {
      return { ...state, submitting: false }
    }
    default:
      return state
  }
}

export default reducer
