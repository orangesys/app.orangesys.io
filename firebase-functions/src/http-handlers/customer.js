// @flow
/* eslint-disable no-console */
import stripe from 'stripe'
import Customer from '../core/customer'

type Config = {
  stripe: {
    secret_key: string,
  }
}

export const createCustomer = async (req: Object, res: Object, config: Config) => {
  const { body } = req
  if (!body) {
    res.status(400).send('body is empty.')
    return
  }
  const { token, planId, uid, email } = body
  if (!token || !planId || !uid || !email) {
    res.status(400).end('params are missing (token, planId, uid, email).')
    return
  }
  try {
    const stripeInstance = stripe(config.stripe.secret_key)
    const customer = new Customer(stripeInstance, token)
    const customerData = await customer.create({ email, uid })
    const subscription = await customer.subscribe(customerData, planId)
    const data = {
      customerId: customerData.id,
      subscriptionId: subscription.id,
    }
    res.end(JSON.stringify(data))
    console.log('response data:', data)
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/json' })
    const errorData = err.raw || err
    console.error('error:', errorData, 'body:', body)
    res.end(JSON.stringify(errorData))
  }
}

export const changeCard = async (req: Object, res: Object, config: Config) => {
  const { body } = req
  if (!body) {
    res.writeHead(400)
    res.end('body is empty.')
    return
  }
  const { token, customerId } = body
  if (!token || !customerId) {
    res.writeHead(400)
    res.end('params are missing (token, customerId).')
    return
  }
  const stripeInstance = stripe(config.stripe.secret_key)
  const customer = new Customer(stripeInstance, token)
  try {
    await customer.changeCard(customerId)
    res.end('ok')
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/json' })
    const errorData = err.raw || err
    console.error('error:', errorData, 'body:', body)
    res.end(JSON.stringify(errorData))
  }
}
