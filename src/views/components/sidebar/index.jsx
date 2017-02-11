import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ServerIcon from 'material-ui/svg-icons/file/cloud';
import PlanIcon from 'material-ui/svg-icons/action/class';
import GrafanaIcon from 'material-ui/svg-icons/action/assessment';
import InfluxDBIcon from 'material-ui/svg-icons/device/data-usage';
import InquiryIcon from 'material-ui/svg-icons/communication/contact-mail';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';
import { hashHistory as history } from 'react-router';
import { authActions } from 'src/core/auth/';
import styles from './index.css';

const iconStyle = { width: 32, height: 32, color: 'white' };
const groups = [
  {
    id: 'server-setup', title: 'Server', Icon: ServerIcon,
    path: 'server-setup', hideOnSettingUp: false, hideNormally: true,
  },
  {
    id: 'plan', title: 'Plan', Icon: PlanIcon,
    path: '', hideOnSettingUp: false, hideNormally: false,
  },
  {
    id: 'grafana', title: 'Grafana', Icon: GrafanaIcon,
    path: 'grafana', hideOnSettingUp: true, hideNormally: false,
  },
  {
    id: 'influxdb', title: 'InfluxDB', Icon: InfluxDBIcon,
    path: 'influxdb', hideOnSettingUp: true, hideNormally: false,
  },
  {
    id: 'settings', title: 'Settings', Icon: SettingsIcon,
    path: 'settings', hideOnSettingUp: false, hideNormally: false,
  },
  {
    id: 'inquiry', title: 'Inquiry', Icon: InquiryIcon,
    path: 'inquiry', hideOnSettingUp: false, hideNormally: false,
  },
];

const Sidebar = ({ onSignOut, jumpTo, pageGroup, needServerSetup }) => (
  <nav className={styles.whole}>
    <div className={styles.item}>
    </div>
    {groups.map(({ id, title, Icon, path, hideOnSettingUp, hideNormally }) => (
      <div
        key={`sidebar-group-${id}`}
        style={
          (needServerSetup && hideOnSettingUp) || (!needServerSetup && hideNormally)
          ? { display: 'none' } : {}
        }
        className={`${styles.item} ${pageGroup === id && styles['item-selected']}`}
        onClick={() => jumpTo(path)}
      >
        <Icon className={styles.icon} style={iconStyle} />
        <div className={styles.text}>{title}</div>
      </div>
    ))}
    <div className={`${styles.item}`} onClick={onSignOut}>
      <LogoutIcon className={styles.icon} style={iconStyle} />
      <div className={styles.text}>Logout</div>
    </div>
  </nav>
);

Sidebar.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  pageGroup: PropTypes.string.isRequired,
  needServerSetup: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
  jumpTo: (page) => {
    history.replace(`/dashboard/${page}`);
  },
  onSignOut: () => {
    dispatch(authActions.signOut());
  },
});


export default connect(null, mapDispatchToProps)(Sidebar);
