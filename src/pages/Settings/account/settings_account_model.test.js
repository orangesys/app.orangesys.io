import { createModel } from '@xstate/test'
import { BaseInfoMachine } from './BaseInfoMachine'

const settingModel = createModel(BaseInfoMachine).withEvents({
  SUBMIT: {},
})

describe('account setting', () => {
  const testPlans = settingModel.getShortestPathPlans()

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, async () => {
          // do any setup, then...
          const func = state => {
            console.log(state)
          }

          await path.test(func)
        })
      })
    })
  })

  it('should have full coverage', () => {
    return settingModel.testCoverage()
  })
})
