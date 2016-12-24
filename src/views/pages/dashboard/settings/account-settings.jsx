import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
// import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { getProfile } from 'src/core/auth';
import { settingsActions, getSettings } from 'src/core/settings';
import { getInputValues } from 'src/views/utils';

import styles from './account-settings.css';

const AccountSettings = ({
  companyName, fullName, updatingProfile, fieldErrors,
  onSubmitProfile,
}) => (
  <div className={styles.whole}>
    <Grid>
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
        </Col>
      </Row>
    </Grid>
  </div>
);

AccountSettings.propTypes = {
  companyName: PropTypes.string,
  fullName: PropTypes.string,
  updatingProfile: PropTypes.bool,
  fieldErrors: PropTypes.object,
  onSubmitProfile: PropTypes.func.isRequired,
};

const mapStateToProps = createSelector(
  getProfile,
  getSettings,
  (
    { companyName, fullName },
    { updatingProfile, fieldErrors }
  ) => ({
    companyName, fullName,
    updatingProfile, fieldErrors,
  }),
);

const mapDispatchToProps = (dispatch) => ({
  onSubmitProfile: (e) => {
    e.preventDefault();
    const values = getInputValues(['companyName', 'fullName'], e.target);
    dispatch(settingsActions.updateProfile(values));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
