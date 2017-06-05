import 'babel-polyfill'
import assert from 'power-assert'
import moment from 'moment'
import td from 'testdouble'

import Invoice, { Calculations } from '../../../src/core/invoice'

describe('Calculations', () => {
  describe('calculatDiscountOfProRatedCharge', () => {
    it('calculates discount', () => {
      [
        { price: 1000, date: '2016-10-01', expected: 0 },
        { price: 1000, date: '2016-10-11', expected: 300 },
        { price: 1000, date: '2016-10-30', expected: 933 },
        { price: 1000, date: '2016-10-31', expected: 967 },
        { price: 50000, date: '2016-10-01', expected: 0 },
        { price: 50000, date: '2016-10-11', expected: 15000 },
        { price: 50000, date: '2016-10-30', expected: 46667 },
        { price: 50000, date: '2016-10-31', expected: 48333 },
      ].forEach(({ price, date, expected }) => {
        const time = moment(date).utcOffset('+09:00')
        assert(Calculations.calculateDiscountOfProRatedCharge(price, time) === expected)
      })
    })
  })
})

describe('Invoice', () => {
  describe('isFirstSubscription', () => {
    it('returns true if the subscription started last month', () => {
      const invoice = new Invoice({})
      invoice.data = { date: moment('2017-04-01').unix() }
      invoice.subscription = { created: moment('2017-03-15') }
      assert(invoice.isFirstSubscription() === true)
    })
    it('returns false if the subscription started more than a month ago', () => {
      const invoice = new Invoice({})
      invoice.data = { date: moment('2017-05-01').unix() }
      invoice.subscription = { created: moment('2017-03-15') }
      assert(invoice.isFirstSubscription() === false)
    })
  })

  describe('addInvoiceItemForProRatedChargeDiscount', () => {
    beforeEach(td.reset)
    it('adds an invoice item of discount', async () => {
      const amount = 50000
      const discount = 20000
      const data = {
        customer: 'dummy-customer',
        id: 'dummy-id',
        lines: {
          data: [{ amount }],
        },
      }
      class CalcDummy {
        static calculateDiscountOfProRatedCharge() {
          return discount
        }
      }
      const invoice = new Invoice({}, CalcDummy)
      invoice.subscription = { created: moment().unix() }
      invoice.data = data
      td.replace(invoice, 'addInvoice')
      await invoice.addInvoiceItemForProRatedChargeDiscount()
      td.verify(invoice.addInvoice({
        customer: data.customer,
        invoice: data.id,
        amount: -discount,
        currency: 'jpy',
        description: '初月日割分控除',
      }))
    })
  })

  describe('onCreate', () => {
    it('add an invoice if it is first subscription', async () => {
      const invoice = new Invoice({})
      td.replace(invoice, 'retrieveSubscription')
      td.when(invoice.retrieveSubscription())
        .thenResolve({ created: moment().unix() })
      td.replace(invoice, 'isFirstSubscription')
      td.when(invoice.isFirstSubscription()).thenReturn(true)
      td.replace(invoice, 'addInvoiceItemForProRatedChargeDiscount')

      await invoice.onCreate({ thisIs: 'data' })
      td.verify(invoice.addInvoiceItemForProRatedChargeDiscount())
    })

    it("doesn't add an invoice if it is not first subscription", async () => {
      const invoice = new Invoice({})
      td.replace(invoice, 'retrieveSubscription')
      td.when(invoice.retrieveSubscription())
        .thenResolve({ created: moment().unix() })
      td.replace(invoice, 'isFirstSubscription')
      td.when(invoice.isFirstSubscription()).thenReturn(false)
      td.replace(invoice, 'addInvoiceItemForProRatedChargeDiscount')

      await invoice.onCreate({ thisIs: 'data' })
      td.verify(invoice.addInvoiceItemForProRatedChargeDiscount(), { times: 0 })
    })
  })
})
