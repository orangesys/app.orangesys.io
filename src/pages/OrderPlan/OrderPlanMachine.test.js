import { createModel } from '@xstate/test'
import { OrderPlanMachine } from './OrderPlanMachine'

const OrderPlanModel = createModel(OrderPlanMachine).withEvents({
  CHOOSE: {},
  SUBMIT: {},
  CHANGE_PLAN: {},
  RESPONSE: {},
})

describe('order plan', () => {
  const testPlans = OrderPlanModel.getShortestPathPlans()

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
    return OrderPlanModel.testCoverage()
  })
})
