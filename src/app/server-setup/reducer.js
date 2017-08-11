// @flow

import * as ACTION_TYPES from './actions'

export type State = {
  errorCode: ?string,
}

type Action = {
  type: string,
  errorCode?: string,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.SET_ERROR:
      return { ...state, errorCode: action.errorCode }
    default:
      return state
  }
}

export default reducer
