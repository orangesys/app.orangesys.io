// @flow
import firebase from 'firebase'
import { User, UserService } from '../../../core'
import { ACTION_TYPES as USER_ACTION_TYPES } from '../../common/user'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../../common/error'
import { ACTION_TYPES as MESSAGE_ACTION_TYPES } from '../../common/message'

export const UPDATE_PROFILE: string = 'settings-account/update-profile'
export const UPDATE_PROFILE_FINISH: string = 'settings-account/update-profile-finish'
export const CHANGE_EMAIL: string = 'settings-account/change-email'
export const CHANGE_EMAIL_FINISH: string = 'settings-account/change-email-finish'

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

  async updateProfile(user: User, company: string, fullName: string) {
    this.dispatch({ type: UPDATE_PROFILE })
    try {
      const updatedUser: User =
        await this.userService.updateProfile(user.getId(), company, fullName)
      this.dispatch({ type: USER_ACTION_TYPES.SET, user: updatedUser })
      this.dispatch({
        type: MESSAGE_ACTION_TYPES.SET,
        message: 'プロフィールを更新しました。',
      })
    } catch (e) {
      this.dispatch({
        type: ERROR_ACTION_TYPES.SET_ERROR,
        error: e,
      })
    } finally {
      this.dispatch({
        type: UPDATE_PROFILE_FINISH,
      })
    }
  }

  async changeEmail(user: User, email: string, password: string) {
    this.dispatch({ type: CHANGE_EMAIL })
    try {
      const updatedUser = await this.userService.changeEmail(
         this.firebaseRoot, user, email, password)
      this.dispatch({ type: USER_ACTION_TYPES.SET, user: updatedUser })
      this.dispatch({
        type: MESSAGE_ACTION_TYPES.SET,
        message: 'Email変更用のメールを送信しました。',
      })
      setTimeout(() => location.reload(), 2000)  // for email verification
    } catch (e) {
      this.dispatch({
        type: ERROR_ACTION_TYPES.SET_ERROR,
        error: e,
      })
    } finally {
      this.dispatch({
        type: CHANGE_EMAIL_FINISH,
      })
    }
  }
}
