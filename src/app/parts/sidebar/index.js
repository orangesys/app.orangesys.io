// @flow
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Component from './component'
import Actions from './actions'
import { UserRepository } from '../../../core'
import { FirebaseFactory } from '../../../lib/firebase'
import { RouterOperation } from '../../../lib/router'

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch: Dispatch) => {
  const firebase = FirebaseFactory.getInstance()
  const userRepository = new UserRepository(firebase.auth, firebase.db)
  const routerOperation = RouterOperation.getInstance()
  return {
    actions: new Actions(dispatch, userRepository, routerOperation),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
