// @flow
import { UserService, UserRepository } from '../../../core'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../../common/error'

export const CHANGE_STATUS = 'reset-password/change-status'

export default class Actions {
  dispatch: (action: any) => any
  userService: UserService
  userRepository: UserRepository
  constructor(
    dispatch: (action: any) => any,
    userService: UserService,
    userRepository: UserRepository,
  ) {
    this.dispatch = dispatch
    this.userRepository = userRepository
    this.userService = userService
  }
  async verify(code: string): Promise<?string> {
    this.dispatch({ type: CHANGE_STATUS, status: 'VERIFYING' })
    try {
      const email = await this.userRepository.verifyPasswordResetCode(code)
      this.dispatch({ type: CHANGE_STATUS, status: 'VERIFIED' })
      return email
    } catch (e) {
      this.dispatch({ type: CHANGE_STATUS, status: 'INVALID' })
      return null
    }
  }

  async changePassword(code: string, password: string): Promise<boolean> {
    this.dispatch({ type: CHANGE_STATUS, status: 'RESETTING' })
    try {
      await this.userRepository.resetPassword(code, password)
      this.dispatch({ type: CHANGE_STATUS, status: 'RESET' })
      return true
    } catch (error) {
      this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error })
      return false
    }
  }

  invalidate() {
    this.dispatch({ type: CHANGE_STATUS, status: 'INVALID' })
  }

}
