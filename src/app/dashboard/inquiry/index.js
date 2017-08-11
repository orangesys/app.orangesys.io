// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import Action from './actions'
import Component from './component'
import type { State as InquiryState } from './reducer'
import { FirebaseFactory } from '../../../lib/firebase'
import { InquiryRepository } from '../../../core'

export { default as reducer } from './reducer'
export type { InquiryState }

const mapStateToProps = ({ user, inquiry }) => ({ user, inquiry })

const mapDispatchToProps = (dispatch: Dispatch) => {
  const firebase = FirebaseFactory.getInstance()
  const inquiryRepository = new InquiryRepository(firebase.db)
  return {
    actions: new Action(dispatch, inquiryRepository),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
