// @flow

import assert from 'power-assert'
import td from 'testdouble'
import StoreCreator from '..'

describe('StoreCreator', () => {
  describe('create', () => {
    it('create a store with reducers and middlewares', () => {
      const redux = td.object({
        combineReducers: () => {},
        applyMiddleware: () => {},
        createStore: () => {},
      })
      const reducers = {
        reducers: () => {},
      }
      const initialState = { initial: 'state' }
      const combinedReducers = { combined: true }
      const appliedMiddlewares = { applied: true }
      const store = { store: true }
      td.when(redux.combineReducers(reducers, initialState)).thenReturn(combinedReducers)
      td.when(redux.applyMiddleware(td.matchers.anything())).thenReturn(appliedMiddlewares)
      td.when(redux.createStore(combinedReducers, appliedMiddlewares))
        .thenReturn(store)
      const storeCreator = new StoreCreator(redux, true)
      const result = storeCreator.create(reducers, initialState)
      assert.deepEqual(result, store)
    })
  })
})
