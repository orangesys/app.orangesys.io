// @flow
import 'babel-polyfill'
import assert from 'power-assert'
import InvoiceCreated from '../../../src/notification/invoice-created'

describe('createBodyData', () => {
  it('returns proper body data', () => {
    const notification = new InvoiceCreated('dummy-url')
    const customerName = 'customer-name1'
    const invoiceId = 'invoice-id-1'
    const ingradients = { customerName, invoiceId }
    const result = notification.createBodyData(ingradients)
    const expected = {
      username: 'stripe',
      icon_emoji: ':stripe:',
      attachments: [{
        fallback: 'new invoice is created',
        title: 'new invoice is created',
        title_link: `https://dashboard.stripe.com/invoices/${invoiceId}`,
        text: `new invoice to ${customerName} is created.`,
        color: '#36a64f',
      }],
    }
    assert.deepEqual(result, expected)
  })
})
