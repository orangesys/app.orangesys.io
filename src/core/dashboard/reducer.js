import { createReducer } from 'redux-act';
import { Record, Map } from 'immutable';

import {
  confirmPlanCancel,
  cancelPlanCancel,
  setMessage,
  setErrorMessage,
  clearMessage,
  // cancelPlan,
  fetchInfluxDBStorageUsageFinished,
  sendInquiry,
  sendInquiryValidationFailed,
  sendInquiryFailed,
  sendInquiryFinished,
  inqueryBodyChanged,
} from './actions';

const DashboardState = new Record({
  confirmingPlanCancel: false,
  message: null,
  errorMessage: null,
  storageUsage: -1,
  inquiry: new Map({ body: '' }),
  submitting: false,
  fieldErrors: new Map(),
});

export const dashboardReducer = createReducer({
  [setMessage]: (state, message) => (
    state.merge({ message })
  ),
  [setErrorMessage]: (state, errorMessage) => (
    state.merge({ errorMessage })
  ),
  [clearMessage]: (state) => (
    state.merge({ message: null, errorMessage: null })
  ),
  [confirmPlanCancel]: (state) => (
    state.merge({
      confirmingPlanCancel: true,
    })
  ),
  [cancelPlanCancel]: (state) => (
    state.merge({
      confirmingPlanCancel: false,
    })
  ),
  [fetchInfluxDBStorageUsageFinished]: (state, { storageUsage }) => (
    state.merge({ storageUsage })
  ),
  [inqueryBodyChanged]: (state, body) => (
    state.merge({ inquiry: new Map({ body }) })
  ),
  [sendInquiry]: (state) => (
    state.merge({ submitting: true })
  ),
  [sendInquiryValidationFailed]: (state, fieldErrors) => (
    state.merge({
      submitting: false,
      fieldErrors,
    })
  ),
  [sendInquiryFailed]: (state) => (
    state.merge({
      submitting: false,
      errorMessage: '問い合わせの送信に失敗しました',
    })
  ),
  [sendInquiryFinished]: (state) => (
    state.merge({
      submitting: false,
      message: 'お問い合わせ内容が送信されました。運営よりご連絡させて頂きます。',
      inquiry: new Map({ body: '' }),
      fieldErrors: new Map(),
    })
  ),
}, new DashboardState());
