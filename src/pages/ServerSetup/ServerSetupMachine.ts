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
    },
    building: {
      on: {
        NOTIFY_SUCCESS: 'success',
        NOTIFY_ERROR: 'error',
      },
      after: {
        1: {
          target: 'building',
          actions: assign({
            timer: (context, event) => context.timer + 1,
          }),
        },
      },
    },
    error: {
      type: 'final',
    },
    success: {
      type: 'final',
      entry: 'goNextPage',
    },
  },
})
