// @flow
import { ACTION_TYPES as MESSAGE_ACTION_TYPES } from '../common/message'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../common/error'

export default class ActionDispatcher {
  dispatch: (action: any) => any;
  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }
  clearMessage() {
    this.dispatch({ type: MESSAGE_ACTION_TYPES.CLEAR })
  }
  clearError() {
    this.dispatch({ type: ERROR_ACTION_TYPES.CLEAR_ERROR })
  }
}
