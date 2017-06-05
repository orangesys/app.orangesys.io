// @flow

import 'babel-polyfill'
import { config, https, database } from 'firebase-functions'
import admin from 'firebase-admin'
import _cors from 'cors'

import promisify from 'es6-promisify'
import * as httpHandlers from './http-handlers'
import * as dbHandlers from './db-handlers'

admin.initializeApp(config().firebase)
const cors = promisify(_cors())

type Handler = (req: Object, res: Object, config: Object) => Promise<*>;
type Method = 'get' | 'post' | 'put' | 'delete' | 'options';

const prepareHttpFunction = (method: Method, handler: Handler): Function => async (req, res) => {
  await cors(req, res)
  console.log(
      `method: ${req.method}, url: ${req.originalUrl}, params: %j, body: %j`,
      req.params, req.body)
  if (req.method.toLowerCase() !== method) {
    res.status(400).send(`http method ${req.method} is not supported.`)
    return
  }
  handler(req, res, config())
}

// http triggers
export const hello = https.onRequest(prepareHttpFunction('get', (req, res) => res.send('ok')))
export const customers = https.onRequest(prepareHttpFunction('post', httpHandlers.createCustomer))
export const changeCard = https.onRequest(prepareHttpFunction('post', httpHandlers.changeCard))
export const webhooks = https.onRequest(prepareHttpFunction('post', httpHandlers.handle))

// db triggers
export const sendInquiryNotification =
  database.ref('/inquiries/{id}').onWrite(async event => (
    dbHandlers.sendInquiryNotification(event, admin, config)
  ))
