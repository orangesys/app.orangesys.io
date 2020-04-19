import { Machine, assign } from 'xstate'

type StateSchema = {
  states: {
    idle: {}
    submitting: {}
  }
}

type Event = { type: 'SUBMIT' }

type Context = {
  data?: any
  error?: any
}

export const AccountSettingMachine = Machine<Context, StateSchema, Event>({
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
      meta: {
        test: (func: Function) => {
          func('submitting')
        },
      },
    },
  },
})
