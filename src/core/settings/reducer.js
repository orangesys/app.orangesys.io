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
} from './actions';


const SettingsState = new Record({
  updatingProfile: false,
  showingEmailChange: false,
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
}, new SettingsState);
