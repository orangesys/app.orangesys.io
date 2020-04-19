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
      meta: {
        test: (func: Function) => {
          func('idle')
        },
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
      meta: {
        test: (func: Function) => {
          func('submitting')
        },
      },
    },
    success: {
      type: 'final',
      entry: 'goNextPage',
      meta: {
        test: (func: Function) => {
          func('success')
        },
      },
    },
    failure: {
      on: {
        FIX: 'idle',
      },
      meta: {
        test: (func: Function) => {
          func('failure')
        },
      },
    },
  },
})
