// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Component from './component'
import Actions from './actions'

const mapStateToProps = ({ setup, user }) => ({ setup, user })

const mapDispatchToProps = (dispatch: Dispatch) => {  // eslint-disable-line
  return {
    actions: new Actions(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
