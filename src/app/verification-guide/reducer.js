// @flow
import * as ACTION_TYPES from './actions'

export type State = {
  submitting: boolean
}

type Action = {
  type: string,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.RESEND_VERIFICATION_MAIL: {
      return { ...state, submitting: true }
    }
    case ACTION_TYPES.RESEND_VERIFICATION_MAIL_FINISH: {
      return { ...state, submitting: false }
    }
    default:
      return state
  }
}

export default reducer
