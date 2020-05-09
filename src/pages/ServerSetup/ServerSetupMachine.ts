import { Machine, assign } from 'xstate'

type ServerSetupContext = {
  error?: any
  timer: number
}

type ServerSetupStateSchema = {
  states: {
    idle: {}
    not_started: {}
    waiting: {}
    error: {}
    success: {}
  }
}

type ServerSetupEvent =
  | { type: 'START_BUILD_SERVER' }
  | { type: 'WAIT' }
  | { type: 'NOTIFY_ERROR' }
  | { type: 'NOTIFY_SUCCESS' }

export const ServerSetupMachine = Machine<ServerSetupContext, ServerSetupStateSchema, ServerSetupEvent>({
  id: 'server-setup',
  initial: 'idle',
  context: {
    error: undefined,
    timer: 0,
  },
  states: {
    idle: {
      on: {
        NOTIFY_SUCCESS: 'success',
        START_BUILD_SERVER: 'not_started',
        WAIT: 'waiting',
        NOTIFY_ERROR: {
          target: 'error',
          actions: assign({
            error: (_, e) => e,
          }),
        },
      },
      meta: {
        test: (func: Function) => {
          func('idle')
        },
      },
    },
    not_started: {
      after: {
        1000: 'waiting',
      },
      meta: {
        test: (func: Function) => {
          func('not_started')
        },
      },
    },
    waiting: {
      invoke: {
        src: 'fetchServerStatus',
        onDone: {
          target: 'waiting',
        },
        onError: {
          target: 'error',
        },
      },
      on: {
        NOTIFY_SUCCESS: 'success',
        NOTIFY_ERROR: 'error',
      },
      meta: {
        test: (func: Function) => {
          func('waiting')
        },
      },
    },
    error: {
      type: 'final',
      meta: {
        test: (func: Function) => {
          func('error')
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
  },
})
