// @flow

import { connect } from 'react-redux'

import Component from './component'

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(Component)
