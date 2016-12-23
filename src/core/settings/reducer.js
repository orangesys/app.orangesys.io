import { createReducer } from 'redux-act';
import { Record, Map } from 'immutable';

import {
  clearMessage,
  updateProfile,
  updateProfileValidationFailed,
  updateProfileFailed,
  updateProfileSucceeded,
} from './actions';


const SettingsState = new Record({
  updatingProfile: false,
  message: null,
  errorMessage: null,
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
}, new SettingsState);
