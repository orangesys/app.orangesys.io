// @flow
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Layout from './component'
import ActionDispatcher from './actions'
import type { MessageState } from '../common/message'
import type { ErrorState } from '../common/error'
import { User } from '../../core'

type State = {
  user: User,
  message: MessageState,
  error: ErrorState,
}

const mapStateToProps = ({ user, message, error }: State) => ({
  user,
  message: message.message,
  errorMessage: error.message,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: new ActionDispatcher(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
