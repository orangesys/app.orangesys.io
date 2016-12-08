import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Sidebar from 'src/views/components/sidebar';
import { isNeedServerSetup } from 'src/core/auth';
import { getCurrentPageName } from 'src/core/dashboard';
import styles from './index.css';

const DashboardParent = ({ children, pageName, needServerSetup }) => (
  <div className={styles.whole}>
    <Sidebar pageName={pageName} needServerSetup={needServerSetup} />
    <div className={styles.main}>
      <header className={styles.header}>
        {pageName}
      </header>
      {children}
    </div>
  </div>
);

DashboardParent.propTypes = {
  children: PropTypes.object,
  pageName: PropTypes.string,
  needServerSetup: PropTypes.bool,
};

const mapStateToProps = createSelector(
  getCurrentPageName,
  isNeedServerSetup,
  (pageName, needServerSetup) => ({ pageName, needServerSetup }),
);

export default connect(mapStateToProps)(DashboardParent);
