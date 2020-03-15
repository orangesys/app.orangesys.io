import { Machine, assign } from 'xstate'

type StateSchema = {
  states: {
    loading: {}
    failure: {}
    success: {}
  }
}

type Context = {
  data?: any
  error?: any
}

export const UsageMachine = Machine<Context, StateSchema>({
  id: 'usage_machine',
  initial: 'loading',
  context: {
    data: undefined,
    error: undefined,
  },
  states: {
    loading: {
      invoke: {
        src: 'fetchStorageUsage',
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, e) => e.data,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_, e) => e.data.message,
          }),
        },
      },
    },
    success: {
      type: 'final',
    },
    failure: {
      type: 'final',
    },
  },
})
