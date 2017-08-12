// @flow
import firebase from 'firebase'
import { ACTION_TYPES as USER_ACTION_TYPES } from '../common/user'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../common/error'

import { User, UserService } from '../../core'
import type { NewUserFields, ProviderId } from '../../core'

export const SIGNUP_WITH_PASSWORD = 'sign-up/sign-up-with-password'
export const SIGNUP_WITH_PASSWORD_FINISH = 'sign-up/sign-up-with-password-finish'
export const CONNECT_WITH_OAUTH = 'sign-up/connect-with-oauth'
export const SIGNUP_WITH_OAUTH = 'sign-up/sign-up-with-oauth'
export const SIGNUP_WITH_OAUTH_FINISH = 'sign-up/sign-up-with-oauth-finish'


export default class ActionDispatcher {
  dispatch: (action: any) => any
  userService: UserService
  firebaseRoot: any

  constructor(dispatch: (action: any) => any, userService: any, firebaseRoot: any = firebase) {
    this.dispatch = dispatch
    this.userService = userService
    this.firebaseRoot = firebaseRoot
  }

  async signUpWithPassword(password: string, fields: NewUserFields) {
    this.dispatch({ type: SIGNUP_WITH_PASSWORD })
    try {
      const user: User = await this.userService.createUserWithPassword(password, fields)
      this.dispatch({ type: USER_ACTION_TYPES.SET, user })
    } catch (e) {
      this.dispatch({
        type: ERROR_ACTION_TYPES.SET_ERROR,
        error: e,
      })
    } finally {
      this.dispatch({
        type: SIGNUP_WITH_PASSWORD_FINISH,
      })
    }
  }

  async signUpWithOAuth(fields: any) {
    this.dispatch({ type: SIGNUP_WITH_OAUTH })
    try {
      const user: User = await this.userService.createUserWithOAuth(fields)
      this.dispatch({ type: USER_ACTION_TYPES.SET, user })
    } catch (e) {
      this.dispatch({
        type: ERROR_ACTION_TYPES.SET_ERROR,
        error: e,
      })
    } finally {
      this.dispatch({ type: SIGNUP_WITH_OAUTH_FINISH })
    }
  }

  /*
   * @return {boolean} if user already exists
   */
  async connectToOAuthProvider(providerId: ProviderId): Promise<?User> {
    const provider = UserService.generateProvider(this.firebaseRoot, providerId)
    try {
      await this.userService.signInWithOAuth(provider)
      const user = await this.userService.fetchUser()
      this.dispatch({
        type: USER_ACTION_TYPES.SET,
        user,
      })
      this.dispatch({
        type: CONNECT_WITH_OAUTH,
        providerId,
      })
      return user
    } catch (e) {
      console.error(e)  // eslint-disable-line no-console
      this.dispatch({
        type: ERROR_ACTION_TYPES.SET_ERROR,
        error: e,
      })
      return null
    }
  }
}
