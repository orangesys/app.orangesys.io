// @flow
import Slack from './slack'

export default class InvoiceCreated extends Slack {
  createBodyData(ingradients: Object) {
    const { customerName, invoiceId } = ingradients
    return {
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
  }
}
