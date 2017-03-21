import 'babel-polyfill'
import { https } from 'firebase-functions'
import Express from 'express'
import cors from 'cors'
import * as handlers from './handlers'

const prepareFunction = (method, handler) => {
  const app = new Express()
  app.use(cors())
  app.use((req, res, next) => {
    console.log(
      `method: ${req.method}, url: ${req.originalUrl}, params: %j, body: %j`,
      req.params, req.body)
    next()
  })
  app[method]('*', handler)
  return https.onRequest(app)
}

export const hello = prepareFunction('get', (req, res) => res.send('ok'))
export const customers = prepareFunction('post', handlers.createCustomer)
export const changeCard = prepareFunction('post', handlers.changeCard)
export const webhooks = prepareFunction('post', handlers.invoiceCreated)