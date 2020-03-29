import { Machine, assign } from 'xstate'
import { PlanType } from 'modules/plan/plans'

interface OrderContext {
  plan?: PlanType
  card?: Object
  error?: any
  user: any
}

interface OrderStateSchema {
  states: {
    planList: {}
    cardForm: {}
    loading: {}
    success: {}
  }
}

type OrderEvent =
  | { type: 'CHOOSE'; data: PlanType }
  | { type: 'SUBMIT' }
  | { type: 'CHANGE_PLAN' }
  | { type: 'RESPONSE' }

export const OrderPlanMachine = Machine<OrderContext, OrderStateSchema, OrderEvent>({
  id: 'order',
  initial: 'planList',
  context: {
    plan: undefined,
    card: undefined,
    error: undefined,
    user: undefined,
  },
  states: {
    planList: {
      on: {
        CHOOSE: {
          target: 'cardForm',
          actions: assign({
            plan: (_, event) => event.data,
          }),
        },
      },
    },
    cardForm: {
      on: {
        SUBMIT: 'loading',
        CHANGE_PLAN: {
          target: 'planList',
          actions: assign({
            plan: _ => undefined,
          }),
        },
      },
    },
    loading: {
      invoke: {
        src: 'registerPayment',
        onDone: {
          target: 'success',
          actions: assign({
            user: (_, event) => event.data,
          }),
        },
        onError: {
          target: 'cardForm',
          actions: assign({
            error: (_, event) => event.data,
          }),
        },
      },
    },
    success: {
      type: 'final',
      entry: 'goNextPage',
    },
  },
})
