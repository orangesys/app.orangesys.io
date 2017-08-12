// @flow

import * as ACTION_TYPES from './actions'

export type State = {
  submitting: boolean,
}

const reducer = (state: State, action: any) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_PROFILE: {
      return { ...state, submitting: true }
    }
    case ACTION_TYPES.UPDATE_PROFILE_FINISH: {
      return { ...state, submitting: false }
    }
    case ACTION_TYPES.CHANGE_EMAIL: {
      return { ...state, submitting: true }
    }
    case ACTION_TYPES.CHANGE_EMAIL_FINISH: {
      return { ...state, submitting: false }
    }
    default:
      return state
  }
}
export default reducer
