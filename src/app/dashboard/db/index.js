// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import Component from './component'

const mapStateToProps = ({ user }) => ({ user })
const mapDispatchToProps = (dispatch: Dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Component)
