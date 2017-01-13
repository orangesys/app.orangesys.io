import { createReducer } from 'redux-act';
import { Record } from 'immutable';

import {
  confirmPlanCancel,
  cancelPlanCancel,
  setMessage,
  setErrorMessage,
  clearMessage,
  // cancelPlan,
} from './actions';

const DashboardState = new Record({
  confirmingPlanCancel: false,
  message: null,
  errorMessage: null,
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
}, new DashboardState());
