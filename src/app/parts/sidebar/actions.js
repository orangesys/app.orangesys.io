// @flow
import { ACTION_TYPES as USER_ACTION_TYPES } from '../../common/user'
import { RouterOperation } from '../../../lib/router'
import { User, UserRepository } from '../../../core'

export default class Action {
  dispatch: (action: any) => any
  userRepository: UserRepository
  routerOperation: RouterOperation

  constructor(
    dispatch: (action: any) => any,
    userRepository: UserRepository,
    routerOperation: RouterOperation,
  ) {
    this.dispatch = dispatch
    this.userRepository = userRepository
    this.routerOperation = routerOperation
  }

  async signOut() {
    await this.userRepository.signOut()
    this.dispatch({ type: USER_ACTION_TYPES.SET, user: new User() })
    this.routerOperation.redirectTo('/sign-in')
  }
}
