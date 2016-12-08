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
  return 'プラン情報';
};
