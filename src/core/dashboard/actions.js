import { createAction } from 'redux-act';

export const setMessage = createAction('set message');
export const setErrorMessage = createAction('set error message');
export const clearMessage = createAction('clear message');

export const confirmPlanCancel = createAction('confirm plan cancel');
export const cancelPlanCancel = createAction('cancel plan cancel');
export const cancelPlan = createAction('cancel plan');

export const fetchInfluxDBStorageUsage = createAction('fetch InfluxDB storage usage');
export const fetchInfluxDBStorageUsageFinished =
  createAction('fetch influx DB storage usage finished');
