// @flow
import { User, OrangesysApi } from '../../../core'
import { ACTION_TYPES as ERROR_ACTION_TYPES } from '../../common/error'

export const FETCH_STORAGE_USAGE: string = 'plan/get-storage-usage'
export const FETCH_STORAGE_USAGE_FINISH: string = 'plan/get-storage-usage-finish'

export default class Action {
  dispatch: (action: any) => any
  apiClient: OrangesysApi.Client

  constructor(
    dispatch: (action: any) => any,
    apiClient: OrangesysApi.Client,
  ) {
    this.dispatch = dispatch
    this.apiClient = apiClient
  }

  async fetchStorageUsage(user: User): Promise<void> {
    const { consumerId } = user.getApiSecrets()
    this.dispatch({ type: FETCH_STORAGE_USAGE })
    try {
      const storageUsage = await this.apiClient.getStorageUsage(user.getId(), consumerId)
      this.dispatch({ type: FETCH_STORAGE_USAGE_FINISH, storageUsage })
    } catch (e) {
      this.dispatch({
        type: ERROR_ACTION_TYPES.SET_ERROR,
        error: e,
      })
    }
  }
}
