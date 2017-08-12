// @flow

import * as ACTION_TYPES from './actions'

export type State = {
  submitting: boolean,
  signingUpWithOAuth: boolean,
  providerId: ?string,
}

type Action = {
  type: string,
  providerId?: string,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.SIGNUP_WITH_PASSWORD: {
      return { ...state, submitting: true }
    }
    case ACTION_TYPES.SIGNUP_WITH_PASSWORD_FINISH: {
      return { ...state, submitting: false }
    }
    case ACTION_TYPES.CONNECT_WITH_OAUTH: {
      return { ...state, signingUpWithOAuth: true, providerId: action.providerId }
    }
    case ACTION_TYPES.SIGNUP_WITH_OAUTH: {
      return { ...state, submitting: true }
    }
    case ACTION_TYPES.SIGNUP_WITH_OAUTH_FINISH: {
      return { ...state, submitting: false }
    }
    default:
      return state
  }
}

export default reducer
