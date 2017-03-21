import stripe from 'stripe'
import moment from 'moment'
import { round } from 'lodash/math'

export const calculateDiscountOfProRatedCharge = (monthlyPrice, subscriptionStartedAt) => {
  const subscriptionStartedDate = subscriptionStartedAt.date()
  const endOfMonth = subscriptionStartedAt.endOf('month').date()
  const serviceUsingDays = (endOfMonth - subscriptionStartedDate) + 1
  const actualAmount = round((monthlyPrice / 30) * serviceUsingDays)
  if (actualAmount > monthlyPrice) {
    return 0
  }
  return monthlyPrice - actualAmount
}

export default class Invoice {
  constructor(stripeSecretKey, data) {
    this.stripe = stripe(stripeSecretKey)
    this.data = data
  }
  created() {
    if (this.isFirstSubscription()) {
      return this.addInvoiceItemForProRatedChargeDiscount()
    }
    return Promise.resolve({})
  }
  retrieveSubscription() {
    return new Promise((resolve, reject) => {
      this.stripe.subscriptions.retrieve(this.data.subscription, (err, subscription) => {
        if (err) { reject(err); return }
        resolve(subscription)
      })
    })
  }
  addInvoice(data) {
    return new Promise((resolve, reject) => (
      this.stripe.invoiceItems.create(data, (err, invoiceItem) => {
        if (err) { reject(err); return; }
        console.log('An invoice item has been added. invoice: %j', invoiceItem)
        resolve(invoiceItem)
      })
    ))
  }
  addInvoiceItemForProRatedChargeDiscount() {
    const { amount } = this.data.lines.data[0]
    const customerId = this.data.customer
    const invoiceId = this.data.id
    return this.retrieveSubscription()
      .then((subscription) => {
        const subsriptionStartedAt = moment(subscription.created, 'X')
        const invoiceData = {
          customer: customerId,
          invoice: invoiceId,
          amount: -calculateDiscountOfProRatedCharge(amount, subsriptionStartedAt),
          currency: 'jpy',
          description: '初月日割分控除',
        }
        return this.addInvoice(invoiceData)
      })
  }
  isFirstSubscription() {
    const { date, period_start } = this.data
    const invoiceMonth = moment(date, 'X').get('month')
    const subscriptionStartedMonth = moment(period_start, 'X').get('month')
    return (invoiceMonth - subscriptionStartedMonth) === 1
  }
}
