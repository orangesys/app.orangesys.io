import 'babel-polyfill'
import assert from 'power-assert'
import stripe from 'stripe'
import moment from 'moment'
import td from 'testdouble'
import { handle } from '../../src/http-handlers'

const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY
const STRIPE_TEST_CUSTOMER_ID = process.env.STRIPE_TEST_CUSTOMER_ID
const STRIPE_TEST_PLAN_ID = process.env.STRIPE_TEST_PLAN_ID

const stripeApi = stripe(process.env.STRIPE_TEST_SECRET_KEY)

const getCurrentTime = () => moment().utcOffset('+09:00')
const subscriptionTime = (additionalMonth, currentTime = getCurrentTime()) => (
  currentTime.utcOffset('+09:00')
    .add(additionalMonth, 'month')
    .set('date', 1)
    .set('hour', 11)
    .set('minute', 0)
    .set('second', 0)
    .unix()
)

class StripeTestDataManager {
  constructor(_stripe, customerId, planId, trialEnd) {
    this.stripe = _stripe
    this.customerId = customerId
    this.planId = planId
    this.trialEnd = trialEnd
    this.customer = null
    this.subscription = null
    this.invoice = null
    this.invoiceItem = null
  }

  retrieveCustomer() {
    return new Promise((resolve, reject) => {
      this.stripe.customers.retrieve(this.customerId, (e, customer) => {
        if (e) { reject(e); return }
        this.customer = customer
        console.log('customer: ', customer)
        resolve(customer)
      })
    })
  }

  async retrievePlan() {
    return new Promise((resolve, reject) => {
      this.stripe.plans.retrieve(this.planId, (e, plan) => {
        if (e) { reject(e); return }
        this.plan = plan
        console.log('plan: ', plan)
        resolve(plan)
      })
    })
  }

  subscribe() {
    return new Promise((resolve, reject) => {
      this.stripe.subscriptions.create({
        customer: this.customerId,
        plan: this.planId,
        tax_percent: 8,
        trial_end: this.trialEnd,
      }, (err, subscription) => {
        if (err) { reject(err); return }
        console.log(`new subscription. ${subscription.id}`)
        this.subscription = subscription
        resolve(subscription)
      })
    })
  }

  createInvoiceItem() {
    return new Promise((resolve, reject) => {
      this.stripe.invoiceItems.create({
        customer: this.customerId,
        subscription: this.subscription.id,
        currency: 'jpy',
        amount: 50000,
      }, (err, invoiceItem) => {
        if (err) { reject(err); return }
        console.log(`new invoiceItem. ${invoiceItem.id}`)
        this.invoiceItem = invoiceItem
        resolve(invoiceItem)
      })
    })
  }

  createInvoice() {
    return new Promise((resolve, reject) => {
      stripeApi.invoices.create({
        customer: this.customer.id,
        // subscription: subscription.id,
        // date: trialEndTimestamp(),
      }, (err, invoice) => {
        if (err) { reject(err); return }
        console.log(`new invoice. ${invoice.id}`)
        this.invoice = invoice
        resolve(invoice)
      })
    })
  }

  closeInvoice() {
    return new Promise((resolve, reject) => {
      this.stripe.invoices.update(this.invoice.id, { closed: true }, (err) => {
        if (err) { reject(err); return }
        console.log('close invoice:', this.invoice.id)
        resolve()
      })
    })
  }

  removeSubscription() {
    return new Promise((resolve, reject) => {
      this.stripe.subscriptions.del(this.subscription.id, (err) => {
        if (err) { reject(err); return }
        console.log('cancel subscription:', this.subscription.id)
        resolve()
      })
    })
  }

}

describe('invoiceCreated', () => {
  const config = {
    stripe: { secret_key: STRIPE_TEST_SECRET_KEY },
    webhook: { stripe_invoice: 'https://dummy-webhook-url.com' },
  }
  let testDataManager = null
  let baseData = null
  beforeEach(async () => {
    testDataManager = new StripeTestDataManager(
      stripeApi, STRIPE_TEST_CUSTOMER_ID, STRIPE_TEST_PLAN_ID, subscriptionTime(1),
    )
    await testDataManager.retrieveCustomer()
    await testDataManager.retrievePlan()
    await testDataManager.subscribe()
    await testDataManager.createInvoiceItem()
    await testDataManager.createInvoice()

    baseData = {
      type: 'invoice.created',
      data: {
        object: {
          id: testDataManager.invoice.id,
          date: testDataManager.trialEnd,
          customer: testDataManager.customerId,
          subscription: testDataManager.subscription.id,
          lines: {
            data: [{
              id: testDataManager.subscription.id,
              amount: testDataManager.plan.amount,
              plan: {
                id: testDataManager.planId,
              },
            }],
          },
        },
      },
    }
  })

  it('adds an invoice item for discount on first subscription', async () => {
    const eventData = baseData
    const req = { body: eventData }
    const res = { end: () => {}, writeHead: () => {} }
    const result = await handle(req, res, config)
    assert(result.id != null)
    assert(result.object === 'invoiceitem')
    assert(result.amount <= 0)
    assert(result.description === '初月日割分控除')
    assert(result.invoice === testDataManager.invoice.id)
  })

  it("doesn't add an invoice item for discount from second subscription", async () => {
    const eventData = {
      data: {
        object: {
          ...baseData.data.object,
          date: subscriptionTime(2),
        },
      },
    }
    const req = { body: eventData }
    const res = { end: () => {}, writeHead: () => {} }
    const result = await handle(req, res, config)
    assert.deepEqual(result, null)
  })

  it('returns 204 if stripe request failure', async () => {
    const eventData = {
      type: 'invoice.created',
      data: {
        object: {
          ...baseData.data.object,
          subscription: 'wrong-subscription-id',
        },
      },
    }
    const req = { body: eventData }
    const res = td.object(['end', 'writeHead'])
    await handle(req, res, config)
    td.verify(res.writeHead(204))
  })

  afterEach(async () => {
    await testDataManager.removeSubscription()
    await testDataManager.closeInvoice()
  })
})
