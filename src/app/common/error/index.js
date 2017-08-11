// @flow

import * as ACTION_TYPES from './actions'
import { errors } from '../../../const'

export { ACTION_TYPES }

export type ErrorState = {
  code: ?string,
  message: ?string,
  error: ?any,
}

export const reducer = (state: ErrorState, action: any): ErrorState => {
  switch (action.type) {
    case ACTION_TYPES.SET_ERROR: {
      let message = null
      const error = action.error
      if (error.code) {
        message = errors[error.code]
      }
      if (message == null) { message = 'エラーが発生しました' }
      return {
        code: error.code,
        message,
        error,
      }
    }
    case ACTION_TYPES.CLEAR_ERROR: {
      return {
        code: null,
        message: null,
        error: null,
      }
    }
    default:
      return state
  }
}
