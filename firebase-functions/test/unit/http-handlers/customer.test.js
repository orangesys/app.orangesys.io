/* eslint-disable import/imports-first, class-methods-use-this */
import assert from 'power-assert'
import proxyquire from 'proxyquire'
import td from 'testdouble'

class StubCustomer {
  constructor(_, token) {
    this.stripe = {}
    this.token = token
  }
  changeCard() {
    return new Promise((resolve) => {
      resolve({})
    })
  }
}

const { changeCard } = proxyquire('../../../src/http-handlers/customer', {
  'firebase-functions': {
    config: () => ({ stripe: { secrect_key: 'dummy' } }),
  },
  '../core/customer': {
    default: StubCustomer,
  },
})

describe('changeCard', () => {
  it('returns 200 if succeeded', async () => {
    const token = 'dummy-token'
    const customerId = 'cus_9xrGGO2fLQyQ4D'
    const req = { body: { token, customerId } }
    const res = td.object({ end: () => {} })
    const config = { stripe: { secret_key: 'dummy' } }
    await changeCard(req, res, config)
    td.verify(res.end('ok'))
  })
  it('returns 400 if params are missing', () => {
    const token = 'dummy-token'
    const req = {
      body: { token },
    }
    return new Promise((resolve) => {
      const res = {
        end: (str) => {
          assert(str === 'params are missing (token, customerId).')
          resolve()
        },
        writeHead: () => {},
      }
      changeCard(req, res)
    })
  })
})
