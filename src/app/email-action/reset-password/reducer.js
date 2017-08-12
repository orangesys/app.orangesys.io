// @flow

import * as ACTION_TYPES from './actions'

type Status =
    'WAITING'
  | 'VERIFYING'
  | 'INVALID'
  | 'VERIFIED'
  | 'RESETTING'
  | 'RESET'

export type State = {
  status: Status,
  email: ?string,
}

type Action = {
  type: string,
  status: Status,
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
