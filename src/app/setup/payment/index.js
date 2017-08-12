// @flow
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Component from './component'
import Actions from './actions'
import { FirebaseFactory } from '../../../lib/firebase'
import { UserService, UserRepository, UserFactory } from '../../../core'
import { Requester as StripeRequester } from '../../../core/stripe'

const mapStateToProps = ({ setup, user }) => ({ setup, user })
const mapDispatchToProps = (dispatch: Dispatch) => {  // eslint-disable-line
  const stripeRequester = new StripeRequester()
  const firebase = FirebaseFactory.getInstance()
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const userService = new UserService(userRepository, UserFactory)
  return {
    actions: new Actions(dispatch, stripeRequester, userService),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Component)
