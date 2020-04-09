import { Machine, assign } from 'xstate'

type ServerSetupContext = {
  error?: any
  timer: number
}

type ServerSetupStateSchema = {
  states: {
    idle: {}
    not_started: {}
    building: {}
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
        WAIT: 'building',
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
      invoke: {
        src: 'requestCreatingServer',
        onDone: {
          target: 'building',
        },
        onError: {
          target: 'error',
        },
      },
      meta: {
        test: (func: Function) => {
          func('not_started')
        },
      },
    },
    building: {
      on: {
        NOTIFY_SUCCESS: 'success',
        NOTIFY_ERROR: 'error',
      },
      meta: {
        test: (func: Function) => {
          func('building')
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
