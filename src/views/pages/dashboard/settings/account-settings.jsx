import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import LinearProgress from 'material-ui/LinearProgress';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { getProfile } from 'src/core/auth';
import { settingsActions, getSettings } from 'src/core/settings';
import { getInputValues } from 'src/views/utils';
import ChangeEmail from './change-email';

import styles from './account-settings.css';

const providers = {
  password: 'メールアドレス',
  'google.com': 'Google',
  'github.com': 'Github',
};

const AccountSettings = (props) => {
  const {
    companyName,
    fullName,
    email,
    providerData,
    updatingProfile,
    fieldErrors,
    onSubmitProfile,
    onShowEmailChange,
    onCancelEmailChange,
    onChangeEmail,
    showingEmailChange,
  } = props;
  const enableToChangeEmail = !!providerData.find(p => (p.providerId === 'password'));
  return (
    <div className={styles.whole}>
      <Row>
        <Col md={6} sm={10} xs={12}>
          <Paper className={styles.profile}>
            <form onSubmit={onSubmitProfile}>
              <ul className={styles.attrs}>
                <li>
                  <TextField
                    name="companyName"
                    defaultValue={companyName}
                    floatingLabelText="会社名"
                    fullWidth
                    errorText={fieldErrors.get('companyName')}
                  />
                </li>
                <li>
                  <TextField
                    name="fullName"
                    defaultValue={fullName}
                    floatingLabelText="フルネーム"
                    fullWidth
                    errorText={fieldErrors.get('fullName')}
                  />
                </li>
              </ul>
              {updatingProfile ?
                <div className={styles.progress}>
                  <LinearProgress />
                </div>
                : null
              }
              <RaisedButton
                label="更新"
                type="submit"
                secondary
                disabled={updatingProfile}
              />
            </form>
          </Paper>
          <Paper className={styles.profile}>
            <ul className={styles.attrs}>
              <li>
                <TextField
                  name="email"
                  value={email}
                  floatingLabelText="メールアドレス"
                  fullWidth
                  className={styles.email}
                  underlineShow={false}
                />
                {enableToChangeEmail ?
                  <FlatButton
                    label="メールアドレスの変更"
                    type="button"
                    secondary
                    onClick={onShowEmailChange}
                  />
                  : null
                }
                <ChangeEmail
                  open={showingEmailChange}
                  onCancel={onCancelEmailChange}
                  onSubmit={onChangeEmail}
                  errors={fieldErrors}
                />
              </li>
              <li className={styles.providers}>
                <label className={styles.label}>ログイン方法</label>
                <ul className={styles['provider-list']}>
                  {providerData.map(provider => (
                    <li
                      className={styles['provider-item']}
                      key={`provider-${provider.providerId}`}
                    >
                      {providers[provider.providerId]}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </Paper>
        </Col>
      </Row>
    </div>
  );
};

AccountSettings.propTypes = {
  companyName: PropTypes.string,
  fullName: PropTypes.string,
  email: PropTypes.string,
  providerData: PropTypes.object,
  updatingProfile: PropTypes.bool,
  fieldErrors: PropTypes.object,
  onSubmitProfile: PropTypes.func.isRequired,
  onShowEmailChange: PropTypes.func.isRequired,
  onCancelEmailChange: PropTypes.func.isRequired,
  onChangeEmail: PropTypes.func.isRequired,
  showingEmailChange: PropTypes.bool,
};

const mapStateToProps = createSelector(
  getProfile,
  getSettings,
  (
    { companyName, fullName, email, providerData },
    { updatingProfile, fieldErrors, showingEmailChange }
  ) => ({
    companyName, fullName, email, providerData,
    updatingProfile, fieldErrors, showingEmailChange,
  }),
);

const mapDispatchToProps = (dispatch) => ({
  onSubmitProfile: (e) => {
    e.preventDefault();
    const values = getInputValues(['companyName', 'fullName'], e.target);
    dispatch(settingsActions.updateProfile(values));
  },
  onShowEmailChange: () => {
    dispatch(settingsActions.showEmailChange());
  },
  onCancelEmailChange: () => {
    dispatch(settingsActions.cancelEmailChange());
  },
  onChangeEmail: (inputs) => {
    dispatch(settingsActions.changeEmail(inputs));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
