// @flow
/* eslint-disable no-underscore-dangle */

import { createLogger } from 'redux-logger'
import watch from 'redux-watch'
import better from 'better-combine-reducers'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import type { Store, Middleware } from 'redux'
import { sentry, logException } from '../lib/logger'

import appReducers from './reducers'
import defaultState from './initial-state'

type ReduxFuncs = {
  createStore: Function,
  combineReducers: Function,
  applyMiddleware: Function,
}

type Reducers = {
  [key:string]: Function
}

export default class StoreCreator {
  redux: ReduxFuncs
  devMode: boolean

  constructor(redux: ReduxFuncs, devMode: boolean = false) {
    this.redux = redux
    this.devMode = devMode
  }

  combineReducers(reducers: Reducers, initialState?: Object): any {
    const args = [reducers]
    if (initialState != null) { args.push(initialState) }
    return this.redux.combineReducers(...args)
  }

  middlewares() {
    const middlewareList: Array<Middleware> = []
    if (sentry.isSentryConfigActive) {
      middlewareList.push(sentry.generateRavenMiddleware())
    }
    if (this.devMode) {
      middlewareList.push(createLogger())
    }
    if (!this.devMode || window == null) {
      return this.redux.applyMiddleware(...middlewareList)
    }
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    return composeEnhancers(this.redux.applyMiddleware(...middlewareList))
  }

  create(reducers: Reducers, initialState?: Object): Store {
    const combinedReducers = this.combineReducers(reducers, initialState)
    const middlewares = this.middlewares()
    return this.redux.createStore(combinedReducers, middlewares)
  }
}

export const generateStore = (): Store => {
  const reduxFuncs = {
    createStore,
    combineReducers: better(combineReducers),
    applyMiddleware,
  }
  const devMode = process.env.NODE_ENV !== 'production'
  const storeCreator = new StoreCreator(reduxFuncs, devMode)
  const store = storeCreator.create(appReducers, defaultState)

  const watchError = watch(store.getState, 'error')
  store.subscribe(watchError((error: any) => {
    if (error.message == null) { return }
    if (error.message === 'エラーが発生しました' && error.error != null) {
      logException(error)
    }
  }))
  return store
}
