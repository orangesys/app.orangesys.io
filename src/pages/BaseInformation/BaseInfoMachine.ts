import { Machine, assign } from 'xstate'

type BaseInfoStateSchema = {
  states: {
    idle: {}
    submitting: {}
    failure: {}
    success: {}
  }
}

type BaseInfoEvent = { type: 'SUBMIT' } | { type: 'FIX' }

type BaseInfoContext = {
  data?: any
  error?: any
}

export const BaseInfoMachine = Machine<BaseInfoContext, BaseInfoStateSchema, BaseInfoEvent>({
  id: 'base_information',
  initial: 'idle',
  context: {
    data: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {
        SUBMIT: 'submitting',
      },
    },
    submitting: {
      invoke: {
        src: 'createUserToDB',
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, e) => e.data,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_, e) => e.data,
          }),
        },
      },
    },
    success: {
      type: 'final',
      entry: 'goNextPage',
    },
    failure: {
      on: {
        FIX: 'idle',
      },
    },
  },
})
