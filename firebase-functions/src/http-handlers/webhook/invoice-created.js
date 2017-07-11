// @flow
import Invoice from '../../core/invoice'
import Customer from '../../core/customer'
import Notification from '../../notification/invoice-created'

export default async (
  res: any,
  body: ?Object,
  invoice: Invoice,
  customer: Customer,
  notifier: Notification,
): Promise<any> => {
  // validation
  if (!body || !body.data || !body.data.object) {
    const errMessage = 'request body data is wrong'
    console.error(errMessage)
    res.writeHead(400)
    res.end(errMessage)
    return null
  }

  // main
  const data = body.data
  let result
  try {
    result = await invoice.onCreate(data.object)
  } catch (err) {
    console.error(err)
    if (
      err.type === 'StripeInvalidRequestError' &&
      err.message && /^No such (customer|subscription)/.test(err.message)
    ) {
      res.writeHead(204)
      return null
    }
    res.writeHead(500)
    res.end(err.toString())
    return null
  }

  // notification
  try {
    const customerData = await customer.retrieve(data.object.customer)
    const notificationData = {
      customerName: customerData.email || customerData.id,
      invoiceId: data.object.id,
    }
    await notifier.sendMessage(notificationData)
  } catch (err) {
    console.error(err)
  }
  res.end(JSON.stringify(result))
  return result
}
