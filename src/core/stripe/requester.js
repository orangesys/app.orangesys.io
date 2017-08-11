// @flow

import axios from 'axios'
import config from './config'
import { error } from '../../lib/utils'


type RegisterCustomerResponse = {
  customerId: string,
  subscriptionId: string,
}

class StripeRequester {
  client: any
  apiEndPoint: string

  constructor(apiEndPoint: string = config.paymentApiEndpoint, client: any = axios) {
    this.apiEndPoint = apiEndPoint
    this.client = client
  }

  async registerCustomer(
    token: string, planId: string, uid: string, email: string,
  ): Promise<RegisterCustomerResponse> {
    const url = `${this.apiEndPoint}/customers/`
    try {
      const response = await this.client.post(url, { token, planId, uid, email })
      return response.data
    } catch (e) {
      throw error.generateError(e.message, e.type)
    }
  }

  async changeCredictCard(token: string, customerId: string) {
    const url = `${this.apiEndPoint}/changeCard/`
    try {
      const response = await this.client.post(url, { token, customerId })
      return response.data
    } catch (e) {
      throw error.generateError(e.message, e.type)
    }
  }
}

export default StripeRequester
