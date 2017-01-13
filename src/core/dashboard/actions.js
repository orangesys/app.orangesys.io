import { createAction } from 'redux-act';

export const setMessage = createAction('set message');
export const setErrorMessage = createAction('set error message');
export const clearMessage = createAction('clear message');
// export const copyInfluxDBToken = createAction('copy influxdb token');

export const confirmPlanCancel = createAction('confirm plan cancel');
export const cancelPlanCancel = createAction('cancel plan cancel');
export const cancelPlan = createAction('cancel plan');
