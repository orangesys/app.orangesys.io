import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Sidebar from 'src/views/components/sidebar';
import { isNeedServerSetup } from 'src/core/auth';
import {
  getMessages,
  getCurrentPageName,
  getCurrentPageGroup,
  dashboardActions,
} from 'src/core/dashboard';
import Message from 'src/views/components/message-snackbar';
import styles from './index.css';

const DashboardParent = (props) => {
  const {
    children,
    pageName,
    pageGroup,
    needServerSetup,
    message,
    onMessageClose,
  } = props;
  return (
    <div className={styles.whole}>
      <Sidebar pageGroup={pageGroup} needServerSetup={needServerSetup} />
      <div className={styles.main}>
        <header className={styles.header}>
          {pageName}
        </header>
        {children}
      </div>
      <Message message={message} onClose={onMessageClose} />
    </div>
  );
};

DashboardParent.propTypes = {
  children: PropTypes.object,
  pageName: PropTypes.string,
  pageGroup: PropTypes.string,
  needServerSetup: PropTypes.bool,
  message: PropTypes.string,
  onMessageClose: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getCurrentPageName,
  getCurrentPageGroup,
  isNeedServerSetup,
  getMessages,
  (pageName, pageGroup, needServerSetup, { message }) => ({
    pageName, pageGroup, needServerSetup, message,
  }),
);

const mapDispatchToProps = (dispatch) => ({
  onMessageClose: () => {
    dispatch(dashboardActions.clearMessage());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardParent);
