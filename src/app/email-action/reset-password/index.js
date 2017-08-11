// @flow
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import Actions from './actions'
import Component from './component'
import { UserRepository, UserService, UserFactory } from '../../../core'
import { FirebaseFactory } from '../../../lib/firebase'

export { default as reducer } from './reducer'
export type { State as ResetPasswordState } from './reducer'


const mapStateToProps = ({ user, resetPassword }) => ({ user, resetPassword })

const mapDispatchToProps = (dispatch: Dispatch) => {
  const firebase = FirebaseFactory.getInstance()
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const userService = new UserService(userRepository, UserFactory)
  return {
    actions: new Actions(dispatch, userService, userRepository),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Component)
