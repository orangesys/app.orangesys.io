import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import { getSettings, settingsActions } from 'src/core/settings';
import Message from 'src/views/components/snackbar/message';
import ErrorMessage from 'src/views/components/snackbar/error-message';
import AccountSettings from './account-settings';
import Payment from './payment';

import styles from './index.css';

const Settings = ({ message, errorMessage, onMessageClose }) => (
  <div className={styles.whole}>
    <Tabs>
      <Tab label="アカウント設定" >
        <AccountSettings />
      </Tab>
      <Tab label="支払い方法">
        <Payment />
      </Tab>
      <Tab />
      <Tab />
    </Tabs>
    <Message message={message} onClose={onMessageClose} />
    <ErrorMessage error={errorMessage} onClose={onMessageClose} />
  </div>
);

Settings.propTypes = {
  message: PropTypes.string,
  errorMessage: PropTypes.string,
  onMessageClose: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getSettings,
  ({ message, errorMessage }) => ({ message, errorMessage }),
);
//
const mapDispatchToProps = (dispatch) => ({
  onMessageClose: () => {
    dispatch(settingsActions.clearMessage());
  },
});
//
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
