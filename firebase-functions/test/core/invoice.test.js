import assert from 'power-assert'
import moment from 'moment'
import sinon from 'sinon'

import Invoice, {
  calculateDiscountOfProRatedCharge,
} from '../../src/core/invoice'

const DUMMY_TOKEN = 'asdfasfdasdfasdf'

describe('calculatDiscountOfProRatedCharge', () => {
  it('works', () => {
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
      assert(calculateDiscountOfProRatedCharge(price, time) === expected)
    })
  })
})

describe('Invoice#addInvoiceItemForProRatedChargeDiscount', () => {
  it('add an invoice item if it is first payment', (done) => {
    const subscriptionStartedAt = moment('2016-10-11T00:00:00+0900').format('X')
    const eventData = {
      customer: 'customerId1',
      id: 'invoiceId1',
      date: moment('2016-11-01T11:00:00+0900').format('X'),
      lines: {
        data: [{
          amount: 50000,
          plan: { id: 'planid1' },
        }],
      },
      subscription: 'subscriptionId',
    }
    const invoice = new Invoice(DUMMY_TOKEN, eventData)
    sinon.stub(invoice, 'retrieveSubscription').returns(Promise.resolve({
      created: subscriptionStartedAt,
    }))
    invoice.addInvoice = () => (Promise.resolve({}))
    const mock = sinon.mock(invoice)
    const expectedArgs = {
      customer: eventData.customer,
      invoice: eventData.id,
      amount: -15000,
      currency: 'jpy',
      description: '初月日割分控除',
    }
    mock.expects('addInvoice').withArgs(expectedArgs).once()
    invoice.addInvoiceItemForProRatedChargeDiscount()
      .then(() => {
        assert(mock.verify())
        done()
      })
      .catch(err => done(err))
  })
})

describe('Invoice#isFirstSubscription', () => {
  const shouldBehaves = (date, periodStartDate, expected) => {
    const data = {
      date: moment(date).format('X'),
      period_start: moment(periodStartDate).format('X'),
    }
    const invoice = new Invoice(DUMMY_TOKEN, data)
    assert(invoice.isFirstSubscription() === expected)
  }
  it('return true if it is first subscription', () => {
    shouldBehaves('2016-12-01T11:00:00+09:00', '2016-11-10T00:00:00+09:00', true)
    shouldBehaves('2016-12-01T11:00:00+09:00', '2016-11-01T00:00:00+09:00', true)
    shouldBehaves('2016-12-01T11:00:00+09:00', '2016-11-30T23:59:59+09:00', true)
  })
  it('return false if it is not first subscription', () => {
    shouldBehaves('2016-12-01T11:00:00+09:00', '2016-09-20T00:00:00+09:00', false)
    shouldBehaves('2016-12-01T11:00:00+09:00', '2016-10-31T23:59:59+09:00', false)
    shouldBehaves('2016-12-01T11:00:00+09:00', '2016-12-01T11:00:00+09:00', false)
  })
})
