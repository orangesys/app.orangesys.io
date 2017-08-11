// @flow
/* eslint-disable no-console */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Layout from './layout'
import routes from './routes'
import { route as routeUtil } from '../lib/utils'
import { RouterOperation } from '../lib/router'
import { logException } from '../lib/logger'

import type { UserStatus } from '../lib/router'
import type { User } from '../core'

type Props = {
  user: User,
  defaultPath: string,
  defaultQuery: { [key: string]: string }
}

type DefaultProps = {
  defaultPath: string,
  defaultQuery: { [key: string]: string },
}

type State = {
  path: string,
  query: { [key: string]: string },
  title: ?string,
  CurrentComponent: any,
}

class App extends Component<DefaultProps, Props, State> {
  props: Props
  state: State

  state = {
    path: this.props.defaultPath,
    query: this.props.defaultQuery,
    title: null,
    CurrentComponent: null,
  }

  static defaultProps = {
    defaultPath: '/',
    defaultQuery: {},
  }

  componentWillMount() {
    this.updateStateFromWindowLocation()
    window.addEventListener('hashchange', this.updateStateFromWindowLocation, false)
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.updateStateFromWindowLocation, false)
  }

  get userStatus(): UserStatus {
    const { user } = this.props
    const loggedIn = !!(user && user.authenticated)
    const emailVerified = loggedIn && user.emailVerified
    const planSelected = user && !!user.planId
    const serverSetupCompleted = user && this.props.user.serverSetupCompleted
    return {
      loggedIn,
      emailVerified,
      planSelected,
      serverSetupCompleted,
    }
  }

  get routerProp(): RouterOperation {
    const operation = new RouterOperation(window, this.state.path, this.state.query)
    return operation
  }

  updateStateFromWindowLocation = () => {
    const { path, query } = routeUtil.getRouteInfoFromWindow(window)
    try {
      const {
        accessible,
        redirectPath,
        title,
        TargetComponent,
      } = routes.judge(path, this.userStatus)

      if (!accessible && redirectPath) {
        this.redirectTo(redirectPath)
        return
      }
      this.setState({
        path,
        query,
        title,
        CurrentComponent: TargetComponent,
      })
    } catch (e) {
      logException(e)
    }
  }

  redirectTo(path: string) {
    RouterOperation.redirectTo(path)
  }

  render() {
    const { CurrentComponent } = this.state
    if (CurrentComponent == null) { return null }
    return (
      <Layout currentPath={this.state.path} currentTitle={this.state.title}>
        <CurrentComponent router={this.routerProp} />
      </Layout>
    )
  }
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(App)
