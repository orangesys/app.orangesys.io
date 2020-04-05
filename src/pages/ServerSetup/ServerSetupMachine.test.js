import { createModel } from '@xstate/test'
import { ServerSetupMachine } from './ServerSetupMachine'

const ServerSetupModel = createModel(ServerSetupMachine).withEvents({
  START_BUILD_SERVER: {},
  WAIT: {},
  NOTIFY_ERROR: {},
  NOTIFY_SUCCESS: {},
})

describe('server setup', () => {
  const testPlans = ServerSetupModel.getShortestPathPlans()

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
    return ServerSetupModel.testCoverage()
  })
})
