import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Sidebar from 'src/views/components/sidebar';
import { isNeedServerSetup } from 'src/core/auth';
import { getCurrentPageName, getCurrentPageGroup } from 'src/core/dashboard';
import styles from './index.css';

const DashboardParent = ({ children, pageName, pageGroup, needServerSetup }) => (
  <div className={styles.whole}>
    <Sidebar pageGroup={pageGroup} needServerSetup={needServerSetup} />
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
  pageGroup: PropTypes.string,
  needServerSetup: PropTypes.bool,
};

const mapStateToProps = createSelector(
  getCurrentPageName,
  getCurrentPageGroup,
  isNeedServerSetup,
  (pageName, pageGroup, needServerSetup) => ({ pageName, pageGroup, needServerSetup }),
);

export default connect(mapStateToProps)(DashboardParent);
