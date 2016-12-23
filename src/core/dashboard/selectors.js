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
