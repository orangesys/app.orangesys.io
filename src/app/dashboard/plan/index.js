// @flow
/* eslint-disable no-underscore-dangle */
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import Action from './actions'
import Component from './component'
import type { State as PlanState } from './reducer'
import { OrangesysApi } from '../../../core'

export { default as reducer } from './reducer'
export type { PlanState }

const mapStateToProps = ({ user, plan }) => ({ user, plan })

const fetchDummy = () => (
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        json: () => (
          Promise.resolve({ storageUsage: 3328599654 })
        ),
      })
    }, 2000)
  })
)

const mapDispatchToProps = (dispatch: Dispatch) => {
  const apiClientOptions = {}
  const apiDebug = OrangesysApi.config.apiDebug
  if (apiDebug) {
    // debug mode in development
    apiClientOptions._fetch = fetchDummy
  }
  const apiClient = new OrangesysApi.Client(apiClientOptions)
  return {
    actions: new Action(dispatch, apiClient),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
