import { createReducer } from 'redux-act';
import { Record } from 'immutable';

import {
  confirmPlanCancel,
  cancelPlanCancel,
  // cancelPlan,
} from './actions';

const DashboardState = new Record({
  confirmingPlanCancel: false,
});

export const dashboardReducer = createReducer({
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
