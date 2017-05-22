// @flow
/* eslint-disable no-console */
import { config } from 'firebase-functions'
import Customer from '../core/customer'

const STRIPE_SECRET_KEY = config().stripe.secret_key

export const createCustomer = async (req: Object, res: Object) => {
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
    const customer = new Customer(STRIPE_SECRET_KEY, token)
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

export const changeCard = async (req: Object, res: Object) => {
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
  const customer = new Customer(STRIPE_SECRET_KEY, token)
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
