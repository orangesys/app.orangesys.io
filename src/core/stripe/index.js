// @flow

import Stripe from './stripe'
import { error } from '../../lib/utils'

export default Stripe
export { default as stripeErrors } from './errors'
export { default as stripeConfig } from './config'
export { default as Requester } from './requester'

export const createToken = (form: any): Promise<string> => (
  new Promise((resolve, reject) => {
    Stripe.createToken(form, (status, res) => {
      if (res.error) {
        const err = error.generateError(res.error.message, `stripe/${res.error.type}`)
        reject(err)
        return
      }
      resolve(res.id)
    })
  })
)
