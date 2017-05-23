// @flow
import stripe from 'stripe'
import Invoice from '../core/invoice'

type Config = {
  stripe: {
    secret_key: string,
  }
}

export const invoiceCreated = async (
  req: any, res: any, config: Config,
) => {
  const { body: { data } } = req
  const { body } = req
  console.log('invoiceCreated. body:', body)
  if (!body.data || !body.data.object) {
    const errMessage = 'request body data is wrong'
    console.error(errMessage)
    res.writeHead(400)
    res.end(errMessage)
    return null
  }
  const stripeSecretKey = config.stripe.secret_key
  try {
    const invoice = new Invoice(stripe(stripeSecretKey), data.object)
    const result = await invoice.onCreate()
    res.end(JSON.stringify(result))
    return result
  } catch (err) {
    res.writeHead(500)
    console.error(err)
    res.end(err.toString())
  }
  return null
}

const mappings = {
  'invoice.created': invoiceCreated,
}

export const handle = (req: any, res: any, config: Config) => {
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
  handleEvent(req, res, config)
}
