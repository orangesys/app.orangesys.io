// @flow

import * as ACTION_TYPES from './actions'

export { ACTION_TYPES }

export type MessageState = {
  message: ?string,
}

export const reducer = (state: MessageState, action: any): MessageState => {
  switch (action.type) {
    case ACTION_TYPES.SET: {
      return {
        message: action.message,
      }
    }
    case ACTION_TYPES.CLEAR: {
      return {
        message: null,
      }
    }
    default:
      return state
  }
}
