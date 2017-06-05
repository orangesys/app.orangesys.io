import 'babel-polyfill'
import assert from 'power-assert'
import td from 'testdouble'
import invoiceCreated from '../../../../src/http-handlers/webhook/invoice-created'

describe('invoiceCreated', () => {
  let res
  beforeEach(() => {
    res = td.object({ writeHead: () => {}, end: () => {} })
  })
  afterEach(td.reset)

  it('return 400 status if body.data.object is missing', async () => {
    const result = await invoiceCreated(res, { data: {} }, null, null, null)
    assert(result === null)
    td.verify(res.writeHead(400))
  })
  it('calls invoice.onCreate and notifier.sendMessage with proper args', async () => {
    const objectData = { id: 'dummy-invoice-id', customer: 'dummy-customer-id' }
    const body = { data: { object: objectData } }
    const invoice = td.object({ onCreate: () => {} })
    const customer = td.object({ retrieve: () => {} })
    const onCreateResult = { thisIs: 'dummy result data' }
    const customerData = { email: 'dummy-customer@example.com' }
    const notifier = td.object({ sendMessage: () => {} })
    td.when(invoice.onCreate(body.data.object))
      .thenResolve(onCreateResult)
    td.when(customer.retrieve(objectData.customer))
      .thenResolve(customerData)

    const result = await invoiceCreated(res, body, invoice, customer, notifier)
    assert(result === onCreateResult)
    td.verify(res.end(JSON.stringify(onCreateResult)))
    td.verify(notifier.sendMessage({
      customerName: customerData.email,
      invoiceId: objectData.id,
    }))
  })
})
