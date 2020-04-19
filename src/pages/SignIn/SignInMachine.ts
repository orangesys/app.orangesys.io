import { Machine, assign } from 'xstate'
import { ProviderId } from 'modules/user/user'

interface SignInStateSchema {
  states: {
    idle: {}
    loading: {}
    popup: {}
    success: {}
  }
}

type SignInEvent = { type: 'SUBMIT' } | { type: 'CONNECT_AUTH'; providerId: ProviderId }

interface SignInContext {
  data?: any
  error?: any
  providerId?: ProviderId
}

export const SignInMachine = Machine<SignInContext, SignInStateSchema, SignInEvent>({
  id: 'sign-in',
  initial: 'idle',
  context: {
    data: undefined,
    error: undefined,
    providerId: undefined,
  },
  states: {
    idle: {
      on: {
        SUBMIT: 'loading',
        CONNECT_AUTH: {
          target: 'popup',
          actions: assign({
            providerId: (_, event) => event.providerId,
          }),
        },
      },
      meta: {
        test: (func: Function) => {
          func('idle')
        },
      },
    },
    loading: {
      invoke: {
        src: 'signInWithEmailAndPassword',
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, event) => {
              return event.data
            },
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: (_, event) => {
              return event.data
            },
          }),
        },
      },
      meta: {
        test: (func: Function) => {
          func('loading')
        },
      },
    },
    popup: {
      invoke: {
        src: 'signInWithOAuth',
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, event) => {
              return event.data
            },
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: (_, event) => {
              return event.data
            },
          }),
        },
      },
      meta: {
        test: (func: Function) => {
          func('popup')
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
