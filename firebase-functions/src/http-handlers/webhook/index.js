// @flow
import _stripe from 'stripe'
import invoiceCreated from './invoice-created'
import Invoice from '../../core/invoice'
import Customer from '../../core/customer'
import Notifier from '../../notification/invoice-created'

export { invoiceCreated }

type Config = {
  stripe: {
    secret_key: string,
  },
  webhook: {
    stripe_invoice: string,
  }
}

export const handle = async (req: any, res: any, config: Config): Promise<?Object> => {
  const body = req.body
  console.log('webhook: %j', body)
  if (!body) {
    res.writeHead(400)
    res.end('body is empty.')
    console.error('body is empty')
    return null
  }
  const eventType = body.type
  if (eventType === 'invoice.created') {
    console.log('invoiceCreated. body:', body)
    const stripe = _stripe(config.stripe.secret_key)
    const invoice = new Invoice(stripe)
    const customer = new Customer(stripe, config.stripe.secret_key)
    const notifier = new Notifier(config.webhook.stripe_invoice)
    return await invoiceCreated(res, req.body, invoice, customer, notifier)
  }

  console.log(`we don't handle event ${eventType}`)
  res.end()
  return null
}
