import { Machine, assign } from 'xstate'

type BaseInfoStateSchema = {
  states: {
    idle: {}
    submitting: {}
    // failure: {}
    // success: {}
  }
}

type BaseInfoEvent = { type: 'SUBMIT' } | { type: 'REFRESH' }

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
        src: 'submit',
        onDone: {
          target: 'idle',
          actions: assign({
            data: (_, e) => e.data,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: (_, e) => e.data,
          }),
        },
      },
    },
    // success: {
    //   on: {
    //     REFRESH: 'idle',
    //   },
    //   entry: 'notify',
    // },
    // failure: {
    //   on: {
    //     REFRESH: 'idle',
    //   },
    //   entry: 'notify',
    // },
  },
})
