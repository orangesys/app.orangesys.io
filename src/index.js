/* eslint-disable no-console */
import 'isomorphic-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import App from './app'
import AppLoader from './app/parts/app-loader'
import { generateStore } from './store'
import { initializeApp, FirebaseFactory } from './lib/firebase'
import { UserService, UserFactory, UserRepository } from './core'
import { ACTION_TYPES as USER_ACTION_TYPES } from './app/common/user'
import { route } from './lib/utils'
import { logException } from './lib/logger'

injectTapEventPlugin()

const render = (Component, store) => {
  const { path, query } = route.getRouteInfoFromWindow(window)
  ReactDOM.render(
    <Provider store={store}>
      <Component
        store={store}
        defaultPath={path}
        defaultQuery={query}
      />
    </Provider>,
    document.getElementById('app'),
  )
}

const renderLoader = () => {
  ReactDOM.render(<AppLoader />, document.getElementById('app'),
  )
}

(async () => {
  try {
    renderLoader()
    const store = generateStore()
    initializeApp()
    const firebase = FirebaseFactory.getInstance()
    const userRepository = new UserRepository(firebase.auth, firebase.db)
    const userService = new UserService(userRepository, UserFactory)
    const user = await userService.fetchUser()
    store.dispatch({
      type: USER_ACTION_TYPES.SET,
      user,
    })
    render(App, store)
  } catch (e) {
    logException(e)
  }
})()

if (module.hot) {
  module.hot.accept('./app', () => {
    const store = generateStore()
    render(require('./app'), store) // eslint-disable-line global-require
  })
}
