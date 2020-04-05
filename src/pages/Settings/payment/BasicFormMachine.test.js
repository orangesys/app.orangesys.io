import { createModel } from '@xstate/test'
import { BasicFormMachine } from './BasicFormMachine'

const PaymentModel = createModel(BasicFormMachine).withEvents({
  SUBMIT: {},
  REFRESH: {},
})

describe('payment', () => {
  const testPlans = PaymentModel.getShortestPathPlans()

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          // do any setup, then...
          const func = (state) => {
            console.log(state)
          }

          await path.test(func)
        })
      })
    })
  })

  it('should have full coverage', () => {
    return PaymentModel.testCoverage()
  })
})
