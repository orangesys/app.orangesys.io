// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Component from './component'
import Actions, { RESEND_VERIFICATION_MAIL, RESEND_VERIFICATION_MAIL_FINISH } from './actions'

const ACTION_TYPES = { RESEND_VERIFICATION_MAIL, RESEND_VERIFICATION_MAIL_FINISH }
export { ACTION_TYPES }
export { default as reducer } from './reducer'
export type { State as VerificationGuideState } from './reducer'

const mapStateToProps = ({ user, verificationGuide }) => ({ user, verificationGuide })

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: new Actions(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
