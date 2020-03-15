import { Machine, assign } from 'xstate'

type StateSchema = {
  states: {
    idle: {}
    submitting: {}
    failure: {}
    success: {}
  }
}

type Event = { type: 'SUBMIT' } | { type: 'REFRESH' }

type Context = {
  data?: any
  error?: any
}

export const BasicFormMachine = Machine<Context, StateSchema, Event>({
  id: 'base_form',
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
        src: 'updateCreditCard',
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
      on: {
        REFRESH: 'idle',
      },
      entry: 'notifySuccess',
    },
    failure: {
      on: {
        REFRESH: 'idle',
      },
    },
  },
})
