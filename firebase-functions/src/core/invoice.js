// @flow
import moment from 'moment'
import math from 'lodash/math'

export class Calculations {
  static calculateDiscountOfProRatedCharge(
    monthlyPrice: number, subscriptionStartedAt: moment,
  ): number {
    const subscriptionStartedDate = subscriptionStartedAt.date()
    const endOfMonth = subscriptionStartedAt.endOf('month').date()
    const serviceUsingDays = (endOfMonth - subscriptionStartedDate) + 1
    const actualAmount = math.round((monthlyPrice / 30) * serviceUsingDays)
    if (actualAmount > monthlyPrice) {
      return 0
    }
    return monthlyPrice - actualAmount
  }
}

export default class Invoice {

  stripe: any
  data: Object
  subscription: Object
  calcs: typeof Calculations

  constructor(
    stripe: any,
    calcs: typeof Calculations = Calculations,
  ) {
    this.stripe = stripe
    this.calcs = calcs
  }

  get subscriptionStartedAt(): moment {
    return moment(this.subscription.created, 'X')
  }

  isFirstSubscription(): boolean {
    if (this.data == null) { throw new Error('data is not set') }
    const invoiceMonth = moment(this.data.date, 'X').get('month')
    const subscriptionStartedMonth = this.subscriptionStartedAt.get('month')
    const result = (invoiceMonth - subscriptionStartedMonth) <= 1
    console.log('Invoice#isFirstSubscription ' +
      `result: ${result.toString()}, ` +
      `invoiceMonth: ${invoiceMonth}, ` +
      `subscriptionStartedMonth: ${subscriptionStartedMonth}`,
    )
    return result
  }

  async onCreate(data: Object): Promise<Object> {
    this.data = data
    this.subscription = await this.retrieveSubscription()
    if (!this.isFirstSubscription()) {
      console.log('this is not a first subscription.')
      return {}
    }
    return this.addInvoiceItemForProRatedChargeDiscount()
  }

  retrieveSubscription(): Promise<Object> {
    return new Promise((resolve, reject) => {
      if (!this.data.subscription) { throw new Error('no subscription id.') }
      this.stripe.subscriptions.retrieve(this.data.subscription, (err, subscription) => {
        if (err) { reject(err); return }
        if (!subscription) {
          throw new Error(`subscription ${this.data.subscription} is not found.`)
        }
        resolve(subscription)
      })
    })
  }

  addInvoice(data: Object): Promise<Object> {
    return new Promise((resolve, reject) => (
      this.stripe.invoiceItems.create(data, (err, invoiceItem) => {
        if (err) { reject(err); return }
        console.log('An invoice item has been added. invoice: %j', invoiceItem)
        resolve(invoiceItem)
      })
    ))
  }

  async addInvoiceItemForProRatedChargeDiscount(): Promise<Object> {
    const { amount } = this.data.lines.data[0]
    const customerId = this.data.customer
    const invoiceId = this.data.id

    const discount = this.calcs.calculateDiscountOfProRatedCharge(
      amount, this.subscriptionStartedAt)
    console.log('discount:', discount)
    const invoiceData = {
      customer: customerId,
      invoice: invoiceId,
      amount: -discount,
      currency: 'jpy',
      description: '初月日割分控除',
    }
    console.log('invoiceData:', invoiceData)
    const invoiceItem = await this.addInvoice(invoiceData)
    return invoiceItem
  }
}
