// @ts-nocheck
import { Machine, assign } from 'xstate'
import { ProviderId } from 'modules/user/user'

interface SignUpStateSchema {
  states: {
    idle: {}
    loading_sign_up: {}
    popup: {}
    success: {}
  }
}

type SignUpEvent = { type: 'SUBMIT' } | { type: 'CONNECT_AUTH'; providerId: ProviderId }

export interface SignUpContext {
  data?: any
  error?: any
  providerId?: ProviderId
}

export const SignUpMachine = Machine<SignUpContext, SignUpStateSchema, SignUpEvent>({
  id: 'sign-up',
  initial: 'idle',
  context: {
    data: undefined,
    error: undefined,
    providerId: undefined,
  },
  states: {
    idle: {
      on: {
        SUBMIT: 'loading_sign_up',
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
    // ok
    loading_sign_up: {
      invoke: {
        src: 'signUpWithEmailAndPassword',
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, event) => event.data,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: (_, event) => event.data,
          }),
        },
      },
      meta: {
        test: (func: Function) => {
          func('loading_sign_up')
        },
      },
    },
    popup: {
      invoke: {
        src: 'connectAuth',
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, event) => event.data,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            providerId: undefined,
            error: (_, event) => event.data,
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
