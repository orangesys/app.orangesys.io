import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Sidebar from 'src/views/components/sidebar';
import { getCurrentPageName } from 'src/core/dashboard';
import styles from './index.css';

const DashboardParent = ({ children, pageName }) => (
  <div className={styles.whole}>
    <Sidebar pageName={pageName} />
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
};

const mapStateToProps = createSelector(
  getCurrentPageName,
  (pageName) => ({ pageName }),
);

export default connect(mapStateToProps)(DashboardParent);
