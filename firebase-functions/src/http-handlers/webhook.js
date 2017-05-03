import { config } from 'firebase-functions'
import stripe from 'stripe'
import Invoice from '../core/invoice'

const STRIPE_SECRET_KEY = config().stripe.secret_key

export const invoiceCreated = async (req, res) => {
  const { body: { data } } = req
  const { body } = req
  if (!body.data || !body.data.object) {
    const errMessage = 'request body data is wrong'
    console.error(errMessage)
    res.writeHead(400)
    res.end(errMessage)
    return
  }
  try {
    const invoice = new Invoice(stripe(STRIPE_SECRET_KEY), data.object)
    const result = await invoice.onCreate()
    console.log('response:', result)
    res.end(JSON.stringify(result))
  } catch (err) {
    res.writeHead(500)
    console.error(err)
    res.end(err.toString())
    return
  }
}

const mappings = {
  'invoice.created': invoiceCreated,
}

export const handle = (req, res) => {
  const { body } = req
  console.log('webhook: %j', body)
  if (!body) {
    res.writeHead(400)
    res.end('body is empty.')
    console.error('body is empty')
    return
  }
  const eventType = body.type
  const handleEvent = mappings[eventType]
  if (!handleEvent) {
    console.log(`we don't handle event ${eventType}`)
    res.end()
    return
  }
  handleEvent(req, res)
}
