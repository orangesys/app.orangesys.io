import axios from 'axios'
import { API_ENDPOINT } from './config'

type RegisterCustomerResponse = {
  customerId: string
  subscriptionId: string
}

export const registerCustomer = async (token: string, planId: string, uid: string, email: string) => {
  const url = `${API_ENDPOINT}/customers/`
  const [error, response] = await axios
    .post(url, { token, planId, uid, email })
    .then(data => [null, data])
    .catch(error => [error, null])
  if (error) {
    console.error(error)
    return null
  }
  return response?.data
}

export const changeCreditCard = async (token: string, customerId: string) => {
  const url = `${API_ENDPOINT}/changeCard/`
  const response = await axios.post(url, { token, customerId })
  return response.data
}
