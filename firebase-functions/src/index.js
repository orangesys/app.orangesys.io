import 'babel-polyfill'
import { config, https, database } from 'firebase-functions'
import admin from 'firebase-admin'
import Express from 'express'
import cors from 'cors'
import * as httpHandlers from './http-handlers'
import * as dbHandlers from './db-handlers'

admin.initializeApp(config().firebase)

const prepareHttpFunction = (method, handler) => {
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
export const hello = prepareHttpFunction('get', (req, res) => res.send('ok'))
export const customers = prepareHttpFunction('post', httpHandlers.createCustomer)
export const changeCard = prepareHttpFunction('post', httpHandlers.changeCard)
export const webhooks = prepareHttpFunction('post', httpHandlers.invoiceCreated)

export const sendInquiryNotification =
  database.ref('/inquiries/{id}').onWrite(async (event) => (
    dbHandlers.sendInquiryNotification(event, admin, config)
  ))
