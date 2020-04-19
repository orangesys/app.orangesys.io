import { createModel } from '@xstate/test'
import { SignUpMachine } from './SignUpMachine'

const SignUpModel = createModel(SignUpMachine).withEvents({
  SUBMIT: {},
  CONNECT_AUTH: {},
})

describe('sign up', () => {
  const testPlans = SignUpModel.getShortestPathPlans()

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
    return SignUpModel.testCoverage()
  })
})
