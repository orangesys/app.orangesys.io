// @flow
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import Component from './component'
import Actions from '../actions'
import { UserRepository, UserService, UserFactory } from '../../../core'
import { FirebaseFactory } from '../../../lib/firebase'

const mapStateToProps = ({ user, emailAction }) => ({ user, emailAction })

const mapDispatchToProps = (dispatch: Dispatch) => {
  const firebase = FirebaseFactory.getInstance()
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const userService = new UserService(userRepository, UserFactory)
  return {
    actions: new Actions(dispatch, userService),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Component)
