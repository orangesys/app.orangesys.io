import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ServerIcon from 'material-ui/svg-icons/file/cloud';
import PlanIcon from 'material-ui/svg-icons/action/class';
import GrafanaIcon from 'material-ui/svg-icons/action/assessment';
// import InfluxDBIcon from 'material-ui/svg-icons/image/grain';
import InfluxDBIcon from 'material-ui/svg-icons/device/data-usage';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';
import { hashHistory as history } from 'react-router';
import { authActions } from 'src/core/auth/';
import styles from './index.css';

const iconStyle = { width: 48, height: 48, color: 'white' };

const Sidebar = ({ onSignOut, jumpTo, pageName, needServerSetup }) => (
  <nav className={styles.whole}>
    <div className={styles.item}>
    </div>
    {needServerSetup ?
      <div
        className={`${styles.item} ${pageName === 'サーバー構築' && styles['item-selected']}`}
        onClick={() => jumpTo('server-setup')}
      >
        <ServerIcon className={styles.icon} style={iconStyle} />
        <div className={styles.text}>Server</div>
      </div>
      : null
    }
    <div
      className={`${styles.item} ${pageName === 'プラン情報' && styles['item-selected']}`}
      onClick={() => jumpTo('')}
    >
      <PlanIcon className={styles.icon} style={iconStyle} />
      <div className={styles.text}>Plan</div>
    </div>
    {!needServerSetup ?
      <div
        className={`${styles.item} ${pageName === 'Grafana' && styles['item-selected']}`}
        onClick={() => jumpTo('grafana')}
      >
        <GrafanaIcon className={styles.icon} style={iconStyle} />
        <div className={styles.text}>Grafana</div>
      </div>
      : null
    }
    {!needServerSetup ?
      <div
        className={`${styles.item} ${pageName === 'InfluxDB' && styles['item-selected']}`}
        onClick={() => jumpTo('influxdb')}
      >
        <InfluxDBIcon className={styles.icon} style={iconStyle} />
        <div className={styles.text}>InfluxDB</div>
      </div>
      : null
    }
    <div className={`${styles.item}`} onClick={onSignOut}>
      <LogoutIcon className={styles.icon} style={iconStyle} />
      <div className={styles.text}>Logout</div>
    </div>
  </nav>
);

Sidebar.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  jumpTo: PropTypes.func.isRequired,
  pageName: PropTypes.string.isRequired,
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
