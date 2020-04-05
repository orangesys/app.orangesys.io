import { createModel } from '@xstate/test'
import { SignInMachine } from './SignInMachine'

const SignInModel = createModel(SignInMachine).withEvents({
  SUBMIT: {},
  CONNECT_AUTH: {},
})

describe('sign in', () => {
  const testPlans = SignInModel.getShortestPathPlans()

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
    return SignInModel.testCoverage()
  })
})
