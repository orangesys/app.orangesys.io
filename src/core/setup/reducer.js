import { createReducer } from 'redux-act';
import { Record } from 'immutable';

import {
  selectPlan,
  startRegisteringPayment,
  stripeTokenGenerationError,
  registerPaymentError,
  clearMessage,
} from './actions';

import { stripeErrors } from 'src/core/stripe';

const SetupState = new Record({
  planId: null,
  submitting: false,
  paymentRegistrationError: null,
});

export const setupReducer = createReducer({
  [selectPlan]: (state, { planId }) => (
    state.merge({
      planId,
      submitting: false,
      paymentRegistrationError: null,
    })
  ),
  [startRegisteringPayment]: (state) => (
    state.merge({ submitting: true, paymentRegistrationError: null })
  ),
  [stripeTokenGenerationError]: (state, { type }) => (
    state.merge({
      submitting: false,
      paymentRegistrationError: stripeErrors[type] || 'エラーが発生しました',
    })
  ),
  [registerPaymentError]: (state, errCode) => (
    state.merge({
      submitting: false,
      paymentRegistrationError: stripeErrors[errCode] || '登録処理でエラーが発生しました',
    })
  ),
  [clearMessage]: (state) => (
    state.merge({
      paymentRegistrationError: null,
    })
  ),
}, new SetupState());
