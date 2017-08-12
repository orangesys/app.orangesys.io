// @flow
/* eslint-disable no-underscore-dangle */
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Component from './component'
import Action from './actions'
import { FirebaseFactory } from '../../lib/firebase'
import { UserRepository, UserService, UserFactory, OrangesysApi } from '../../core'

import type { State as ServerSetupState } from './reducer'

export { default as reducer } from './reducer'
export type { ServerSetupState }

const mapStateToProps = ({ serverSetup, user }) => ({ serverSetup, user })

const fetchDummy = (url: string) => (
  new Promise((resolve) => {
    if (/\/create\?uuid=/.test(url)) { resolve(); return }
    if (/\/ping\?jwt=/.test(url)) {
      resolve({
        headers: {
          get: () => 'dummy',
        },
      })
      return
    }
    resolve()
  })
)

const mapDispatchToProps = (dispatch: Dispatch) => {
  const firebase = FirebaseFactory.getInstance()

  const apiClientOptions = {}
  const apiDebug = OrangesysApi.config.apiDebug
  if (apiDebug) {
    // debug mode in development
    apiClientOptions._fetch = fetchDummy
  }

  const apiClient = new OrangesysApi.Client(apiClientOptions)
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const userService = new UserService(userRepository, UserFactory)
  return {
    actions: new Action(
      dispatch, apiClient, userRepository, userService, apiDebug,
    ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
