// @flow
import { UserService } from '../../core'
import { ACTION_TYPES as USER_ACTION_TYPES } from '../common/user'

export const CHANGE_STATUS = 'verify-email/change-status'

export default class Actions {
  dispatch: (action: any) => any
  userService: UserService
  constructor(dispatch: (action: any) => any, userService: UserService) {
    this.dispatch = dispatch
    this.userService = userService
  }
  invalidate() {
    this.dispatch({ type: CHANGE_STATUS, status: 'INVALID' })
  }
  async verify(mode: string, oobCode: string) {
    this.dispatch({ type: CHANGE_STATUS, status: 'VERIFYING' })
    try {
      const user = await this.userService.applyActionCode(oobCode)
      this.dispatch({ type: CHANGE_STATUS, status: 'VERIFIED' })
      this.dispatch({ type: USER_ACTION_TYPES.SET, user })
    } catch (e) {
      this.dispatch({ type: CHANGE_STATUS, status: 'INVALID' })
    }
  }
}
