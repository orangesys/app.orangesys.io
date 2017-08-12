// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import Action from './actions'
import Component from './component'
import { UserService, UserRepository, UserFactory } from '../../../core'
import { FirebaseFactory } from '../../../lib/firebase'
import { Requester as StripeRequester } from '../../../core/stripe'

// export { default as reducer } from './reducer'
// export type { State as AccountSettingsState } from './reducer'


const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch: Dispatch) => {
  const stripeRequester = new StripeRequester()
  const firebase = FirebaseFactory.getInstance()
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const userService = new UserService(userRepository, UserFactory)
  return {
    actions: new Action(dispatch, stripeRequester, userService),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
