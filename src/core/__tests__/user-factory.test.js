// @flow

import assert from 'power-assert'
import moment from 'moment'
import UserFactory from '../user-factory'

describe('UserFactory', () => {
  describe('createFromObject', () => {
    it('can create an instance of User', () => {
      const auth = {}
      const db = {
        companyName: 'companyA',
        createdAt: moment().utc().format(),
        customerId: 'customer1',
        email: 'test@example.com',
        fullName: 'Full Name',
      }
      const obj = {
        auth,
        db,
      }
      const user = UserFactory.createFromObject(obj)
      assert.deepEqual(user.db, db)
    })
  })
})
