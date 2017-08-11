// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Action, * as ACTION_TYPES from './actions'
import Component from './component'
import Firebase, { FirebaseFactory } from '../../lib/firebase'
import { UserService, UserRepository, UserFactory } from '../../core'

export { default as reducer } from './reducer'
export type { State as SignUpState } from './reducer'
export { ACTION_TYPES }

export type InputFieldsForOAuth = {
  companyName: string,
  fullName: string,
}

export type InputFieldsWithPassword = {
  companyName: string,
  fullName: string,
  email: string,
  password: string,
}

const mapStateToProps = ({ signUp, user }) => ({ signUp, user })

const mapDispatchToProps = (dispatch: Dispatch) => {
  const firebase = FirebaseFactory.getInstance()
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const userService = new UserService(userRepository, UserFactory)
  return {
    actions: new Action(dispatch, userService, Firebase.root()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
