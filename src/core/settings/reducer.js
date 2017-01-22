import { createReducer } from 'redux-act';
import { Record, Map } from 'immutable';

import {
  clearMessage,
  updateProfile,
  updateProfileValidationFailed,
  updateProfileFailed,
  updateProfileSucceeded,
  showEmailChange,
  cancelEmailChange,
  changeEmail,
  changeEmailFinished,
  changeEmailValidationFailed,
  changeEmailFailed,
  changeCreditCardField,
  startChangingCreditCard,
  changeCreditCardFailed,
  changeCreditCardFinished,
  stripeTokenGenerationError,
} from './actions';

import { stripeErrors } from 'src/core/stripe';


const SettingsState = new Record({
  updatingProfile: false,
  showingEmailChange: false,
  creditCardFields: new Map(),
  message: null,
  errorMessage: null,
  submitting: false,
  fieldErrors: new Map(),
});

export const settingsReducer = createReducer({
  [clearMessage]: (state) => (
    state.merge({
      message: null,
      errorMessage: null,
    })
  ),
  [updateProfile]: (state) => (
    state.merge({ updatingProfile: true })
  ),
  [updateProfileValidationFailed]: (state, errors) => (
    state.merge({
      updatingProfile: false,
      fieldErrors: new Map(errors),
    })
  ),
  [updateProfileFailed]: (state) => (
    state.merge({
      updatingProfile: false,
      errorMessage: '更新に失敗しました',
      fieldErrors: new Map(),
    })
  ),
  [updateProfileSucceeded]: (state) => (
    state.merge({
      updatingProfile: false,
      message: '更新しました',
      fieldErrors: new Map(),
    })
  ),
  [showEmailChange]: (state) => (
    state.merge({
      showingEmailChange: true,
    })
  ),
  [cancelEmailChange]: (state) => (
    state.merge({
      showingEmailChange: false,
    })
  ),
  [changeEmail]: (state) => (
    state.merge({
      submitting: true,
    })
  ),
  [changeEmailFinished]: (state) => (
    state.merge({
      submitting: false,
      showingEmailChange: false,
      // message: 'メールアドレスを変更しました',
      fieldErrors: new Map(),
    })
  ),
  [changeEmailValidationFailed]: (state, errors) => (
    state.merge({
      submitting: false,
      fieldErrors: errors,
    })
  ),
  [changeEmailFailed]: (state) => (
    state.merge({
      submitting: false,
      errorMessage: 'メールアドレスの変更に失敗しました',
      fieldErrors: new Map(),
    })
  ),
  [changeCreditCardField]: (state, { name, value }) => (
    state.merge({
      creditCardFields: state.creditCardFields.merge({ [name]: value }),
    })
  ),
  [startChangingCreditCard]: (state) => (
    state.merge({
      submitting: true,
    })
  ),
  [stripeTokenGenerationError]: (state, { code }) => (
    state.merge({
      submitting: false,
      errorMessage: stripeErrors[code] || 'エラーが発生しました',
    })
  ),
  [changeCreditCardFailed]: (state, errCode) => (
    state.merge({
      submitting: false,
      errorMessage: stripeErrors[errCode] || '更新処理に失敗しました',
    })
  ),
  [changeCreditCardFinished]: (state) => (
    state.merge({
      submitting: false,
      errorMessage: null,
      message: 'クレジットカード情報を更新しました',
      creditCardFields: new Map(),
    })
  ),
}, new SettingsState);
