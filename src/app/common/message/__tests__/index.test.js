// @flow
import assert from 'power-assert'
import { reducer, ACTION_TYPES } from '..'

describe('reducer', () => {
  describe('SET', () => {
    it('can set a message', () => {
      const state = { message: null }
      const action = { type: ACTION_TYPES.SET, message: 'message1' }
      const result = reducer(state, action)
      assert.deepEqual(result, { message: action.message })
    })

    it('can clear message', () => {
      const state = { message: 'message1' }
      const action = { type: ACTION_TYPES.CLEAR }
      const result = reducer(state, action)
      assert.deepEqual(result, { message: null })
    })
  })
})
