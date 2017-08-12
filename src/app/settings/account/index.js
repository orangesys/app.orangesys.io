// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import Action from './actions'
import Component from './component'
import { UserService, UserRepository, UserFactory } from '../../../core'
import { FirebaseFactory } from '../../../lib/firebase'

export { default as reducer } from './reducer'
export type { State as AccountSettingsState } from './reducer'

const mapStateToProps = ({ user, accountSettings }) => ({ user, accountSettings })

const mapDispatchToProps = (dispatch: Dispatch) => {
  const firebase = FirebaseFactory.getInstance()
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const userService = new UserService(userRepository, UserFactory)
  return {
    actions: new Action(dispatch, userService),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
