// @flow

import * as ACTION_TYPES from './actions'

export type State = {
  fetching: boolean,
  storageUsage: ?number,
}


const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_STORAGE_USAGE: {
      return { ...state, fetching: true }
    }
    case ACTION_TYPES.FETCH_STORAGE_USAGE_FINISH: {
      return {
        ...state,
        fetching: false,
        storageUsage: action.storageUsage,
      }
    }
    default:
      return state
  }
}
export default reducer
