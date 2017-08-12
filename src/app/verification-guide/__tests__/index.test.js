// @flow
import assert from 'power-assert'
import { reducer, ACTION_TYPES } from '..'

describe('reducer', () => {
  describe('RESEND_VERIFICATION_MAIL', () => {
    it('change submitting to true', () => {
      const state = { submitting: false }
      const action = { type: ACTION_TYPES.RESEND_VERIFICATION_MAIL }
      const result = reducer(state, action)
      assert.deepEqual(result, { submitting: true })
    })
  })
  describe('RESEND_VERIFICATION_MAIL_FINISH', () => {
    it('change submitting to false', () => {
      const state = { submitting: true }
      const action = { type: ACTION_TYPES.RESEND_VERIFICATION_MAIL_FINISH }
      const result = reducer(state, action)
      assert.deepEqual(result, { submitting: false })
    })
  })
})
