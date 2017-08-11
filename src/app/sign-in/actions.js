// @flow
import firebase from 'firebase'
import { User, UserService } from '../../core'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../common/error'
import { ACTION_TYPES as USER_ACTION_TYPES } from '../common/user'
import { ACTION_TYPES as MESSAGE_ACTION_TYPES } from '../common/message'
import { ACTION_TYPES as SIGN_UP_ACTION_TYPES } from '../sign-up'
import { error } from '../../lib/utils'
import type { ProviderId } from '../../core'

export const SIGN_IN: string = 'sign-in/sign-in'
export const SIGN_IN_FINISH: string = 'sign-in/sign-in-finish'

export default class Action {
  dispatch: (action: any) => any
  userService: UserService
  firebaseRoot: any

  constructor(
    dispatch: (action: any) => any,
    userService: UserService,
    firebaseRoot: any = firebase,
  ) {
    this.dispatch = dispatch
    this.userService = userService
    this.firebaseRoot = firebaseRoot
  }
  async signInWithPassword(email: string, password: string): Promise<?User> {
    this.dispatch({ type: SIGN_IN })
    try {
      const user = await this.userService.signInWithPassword(email, password)
      if (user && user.authenticated) {
        this.dispatch({ type: USER_ACTION_TYPES.SET, user })
      } else {
        const err = error.generateError(
          'email and password are wrong',
          'custom-auth/email-and-password-are-wrong',
        )
        this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error: err })
      }
      return user
    } catch (e) {
      this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error: e })
      return null
    } finally {
      this.dispatch({ type: SIGN_IN_FINISH })
    }
  }
  async signInWithOAuth(providerId: ProviderId): Promise<?User> {
    const provider = UserService.generateProvider(this.firebaseRoot, providerId)
    try {
      await this.userService.signInWithOAuth(provider)
      const user = await this.userService.fetchUser()
      this.dispatch({ type: USER_ACTION_TYPES.SET, user })
      if (user && !user.db) {
        // set data for sign-up if no db data
        this.dispatch({ type: SIGN_UP_ACTION_TYPES.CONNECT_WITH_OAUTH, providerId })
      }
      return user
    } catch (e) {
      this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error: e })
      return null
    } finally {
      this.dispatch({ type: SIGN_IN_FINISH })
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.userService.sendPasswordResetEmail(email)
      this.dispatch({
        type: MESSAGE_ACTION_TYPES.SET,
        message: 'パスワード再設定用のメールを送信しました。',
      })
    } catch (e) {
      this.dispatch({ type: ERROR_ACTION_TYPES.SET_ERROR, error: e })
    }
  }
}
