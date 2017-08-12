// @flow

import * as ACTION_TYPES from './actions'
import { User } from '../../../core'

export { ACTION_TYPES }

export type UserState = User

export const reducer = (state: User, action: Object): User => {
  switch (action.type) {
    case ACTION_TYPES.SET: {
      return action.user
    }
    default:
      return state
  }
}
