/* eslint-disable class-methods-use-this */
import 'babel-polyfill'
import proxyquire from 'proxyquire'
import td from 'testdouble'

class StubInvoice {
  constructor(_, data) {
    this.stripe = {}
    this.data = data
  }
  onCreate() {
    return new Promise((resolve) => {
      resolve({ success: true })
    })
  }
}

const { invoiceCreated } = proxyquire('../../src/http-handlers/webhook', {
  'firebase-functions': {
    config: () => ({ stripe: { secrect_key: 'dummy' } }),
  },
  '../core/invoice': {
    default: StubInvoice,
  },
})

describe('invoiceCreated', async () => {
  it('works', async () => {
    const req = { body: { data: { object: {} } } }
    const res = {
      writeHead: () => {},
      end: () => {},
    }
    td.replace(res, 'end')
    await invoiceCreated(req, res)
    td.verify(res.end(JSON.stringify({ success: true })))
  })
})
