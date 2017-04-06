import { getLocation } from 'src/core/selectors';

export const getCurrentPageName = (state, ownProps) => {
  const pathname = getLocation(state, ownProps).pathname;
  if (/^\/dashboard\/server-setup/.test(pathname)) {
    return 'サーバー構築';
  }
  if (/^\/dashboard\/grafana/.test(pathname)) {
    return 'Grafana';
  }
  if (/^\/dashboard\/influxdb/.test(pathname)) {
    return 'InfluxDB';
  }
  if (/^\/dashboard\/inquiry/.test(pathname)) {
    return 'お問い合わせ';
  }
  if (/^\/dashboard\/settings/.test(pathname)) {
    return '設定';
  }
  return 'プラン情報';
};

export const getCurrentPageGroup = (state, ownProps) => {
  const pathname = getLocation(state, ownProps).pathname;
  if (/^\/dashboard\/server-setup/.test(pathname)) {
    return 'server-setting';
  }
  if (/^\/dashboard\/grafana/.test(pathname)) {
    return 'grafana';
  }
  if (/^\/dashboard\/influxdb/.test(pathname)) {
    return 'influxdb';
  }
  if (/^\/dashboard\/inquiry/.test(pathname)) {
    return 'inquiery';
  }
  if (/^\/dashboard\/settings/.test(pathname)) {
    return 'settings';
  }
  return 'plan';
};

export const getPlanCancel = state => {
  const { confirmingPlanCancel, cancelingPlan } = state.dashboard;
  return {
    confirmingPlanCancel,
    cancelingPlan,
  };
};

export const getMessages = state => {
  const { message, errorMessage } = state.dashboard;
  return {
    message, errorMessage,
  };
};

export const getFormInfo = state => ({
  fieldErrors: state.dashboard.get('fieldErrors'),
  submitting: state.dashboard.get('submitting'),
});

export const getStorageUsage = state => (
  state.dashboard.get('storageUsage')
);

export const getInquiry = state => state.dashboard.get('inquiry');
