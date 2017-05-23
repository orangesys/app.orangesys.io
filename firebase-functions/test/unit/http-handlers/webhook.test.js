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

const { invoiceCreated } = proxyquire('../../../src/http-handlers/webhook', {
  '../core/invoice': {
    default: StubInvoice,
  },
})

describe('invoiceCreated', async () => {
  it('works', async () => {
    const req = { body: { data: { object: {} } } }
    const res = td.object({
      writeHead: () => {},
      end: () => {},
    })
    const config = { stripe: { secret_key: 'dummy' } }
    await invoiceCreated(req, res, config)
    td.verify(res.end(JSON.stringify({ success: true })))
  })
})
