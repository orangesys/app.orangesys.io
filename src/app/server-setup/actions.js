// @flow
import moment from 'moment'
import { User, UserService, UserRepository, OrangesysApi, SERVER_SETUP_STATUS } from '../../core'
import { logException } from '../../lib/logger'
import { delay } from '../../lib/utils'
import { ACTION_TYPES as USER_ACTION_TYPES } from '../common/user'

export const SET_ERROR = 'server-setup/set-error'

export default class Actions {
  dispatch: (action: any) => any
  apiClient: OrangesysApi.Client
  userRepository: UserRepository
  userService: UserService
  apiDebug: boolean

  constructor(
    dispatch: (action: any) => any,
    apiClient: OrangesysApi.Client,
    userRepository: UserRepository,
    userService: UserService,
    apiDebug: boolean = false,
  ) {
    this.dispatch = dispatch
    this.apiClient = apiClient
    this.userRepository = userRepository
    this.userService = userService
    this.apiDebug = apiDebug
  }

  async requestCreatingServer(user: User) {
    const uid = user.getId()
    const plan = user.getPlan()
    let updatedUser
    try {
      await this.apiClient.createServer(plan.retention, user.getId())
      await this.userRepository.updateServerSetupStatus(
        uid, {
          status: SERVER_SETUP_STATUS.BUILDING,
          startedAt: moment().utc().format(),
        },
      )

      if (this.apiDebug) {
        const dummyConsumerId = 'dummy1'
        const dummyToken = [
          'dummy-ciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiMGQ1MTkzMmVkMmU0NzcwO',
          'WRkYTI5NjM0ZGFjYTg4OCJ9.bdNT2pqqlU8ioTw1VuZ74BeiqCQ9p6hmyeIA5P4tGbI',
        ].join('')
        await this.userRepository.saveApiSecrets(uid, dummyConsumerId, dummyToken)
      }

      updatedUser = await this.userService.fetchUser()

      this.updateUserWithDispatch(updatedUser)
    } catch (err) {
      const errorCode = 'creation_request_error'
      const errorMessage = err.toString()
      logException(err)
      updatedUser = await this.userService.updateServerSetupStatus(
        uid, {
          status: SERVER_SETUP_STATUS.ERRORED,
          errorCode,
          errorMessage,
        },
      )
      this.updateUserWithDispatch(updatedUser)
      this.dispatch({ type: SET_ERROR, errorCode })
    }
  }

  async waitForBuilding() {
    let user
    try {
      let pingCount = 0
      let timeout = false
      while (true) {  // eslint-disable-line no-constant-condition
        if (user == null || user.apiSecrets == null) {
          user = await this.userService.fetchUser()
        }
        if (user.apiSecrets) {
          const { consumerId, token } = user.apiSecrets
          const result = await this.apiClient.ping(consumerId, token)
          pingCount += 1
          if (result) { break }
        }
        if (pingCount >= 10) {
          timeout = true
          break
        }
        await delay(1000 * 1)
      }
      if (timeout) {
        const errorCode = 'server_setup_timeout'
        const status = SERVER_SETUP_STATUS.ERRORED
        if (user == null) { throw new Error() }
        user = await this.userService.updateServerSetupStatus(
          user.getId(), { status, errorCode },
        )
        this.updateUserWithDispatch(user)
        return
      }
      if (user == null) { throw new Error() }
      user = await this.userService.updateServerSetupStatus(
        user.getId(), {
          status: SERVER_SETUP_STATUS.COMPLETED,
          startedAt: moment().utc().format(),
        },
      )
      this.updateUserWithDispatch(user)
    } catch (err) {
      logException(err)
    }
  }

  updateUserWithDispatch(user: User) {
    this.dispatch({ type: USER_ACTION_TYPES.SET, user })
  }
}
