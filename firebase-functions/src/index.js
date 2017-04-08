import 'babel-polyfill'
import { https } from 'firebase-functions'
import Express from 'express'
import cors from 'cors'
import * as httpHandlers from './http-handlers'

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

// http triggers
export const hello = prepareFunction('get', (req, res) => res.send('ok'))
export const customers = prepareFunction('post', httpHandlers.createCustomer)
export const changeCard = prepareFunction('post', httpHandlers.changeCard)
export const webhooks = prepareFunction('post', httpHandlers.invoiceCreated)
