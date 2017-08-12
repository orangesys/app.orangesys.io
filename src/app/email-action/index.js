// @flow
import { connect } from 'react-redux'
import Component from './component'

export { default as VerifyEmail } from './verify-email'
export { default as RecoverEmail } from './recover-email'
export { default as ResetPassword } from './reset-password'
export { default as reducer } from './reducer'
export type { State as EmailActionState } from './reducer'

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(Component)
