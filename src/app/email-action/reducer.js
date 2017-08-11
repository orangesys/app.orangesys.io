// @flow

import * as ACTION_TYPES from './actions'

export type State = {
  status: 'WAITING' | 'VERIFYING' | 'VERIFIED' | 'INVALID'
}

type Action = {
  type: string,
  status: 'WAITING' | 'VERIFYING' | 'VERIFIED' | 'INVALID',
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_STATUS: {
      return { ...state, status: action.status }
    }
    default:
      return state
  }
}

export default reducer
