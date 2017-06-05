import 'babel-polyfill'
import assert from 'power-assert'
import td from 'testdouble'
import moment from 'moment'
import Customer, { trialEndTimestamp } from '../../../src/core/customer'

const dummySecretKey = 'xxxxxxxxx'

describe('trialEndTimestamp', () => {
  const timeFormat = 'YYYY-MM-DD+HH:mm'
  it('works', () => {
    [
      {
        current: moment('2016-10-01+09:00', timeFormat),
        expected: moment('2016-11-01T11:00:00+09:00').unix(),
      },
      {
        current: moment('2016-10-10+09:00', timeFormat),
        expected: moment('2016-11-01T11:00:00+09:00').unix(),
      },
      {
        current: moment('2016-10-31T23:59:59+09:00', timeFormat),
        expected: moment('2016-11-01T11:00:00+09:00').unix(),
      },
    ].forEach(({ current, expected }) => {
      assert(trialEndTimestamp(current) === expected)
    })
  })
})

describe('Customer#retrieve', () => {
  it('calls stripe.customers.retrieve with customerId', async () => {
    const customerId = 'customer-id1'
    const retrieve = td.function()
    const customerData = { thisIs: 'customer data' }
    td.when(retrieve(customerId)).thenCallback(null, customerData)
    const stripe = td.object({ customers: { retrieve } })

    const customer = new Customer(stripe, 'dummy-token')
    const result = await customer.retrieve(customerId)

    assert.deepEqual(result, customerData)
  })
})

describe('Customer#changeCard', () => {
  it('works', () => {
    const customerId = 'cus_9xrGGO2fLQyQ4D'
    const dummyToken = 'dummyToken'
    const customer = new Customer(dummySecretKey, dummyToken)
    // stub
    customer.stripe = {
      customers: {
        update: (id, data, callback) => {
          assert(id === customerId)
          assert.deepEqual(data, { source: dummyToken })
          callback(null, {})
        },
      },
    }
    return customer.changeCard(customerId)
  })
})
