import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { hashHistory as history } from 'react-router';
import { includes } from 'lodash/collection';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Header from '../../components/header-unauth';
import {
  authActions,
  getEmailActionParams,
  getPasswordReset,
} from 'src/core/auth';
import styles from './index.css';

class ResetPassword extends Component {
  componentWillMount() {
    const { oobCode, verifyPasswordResetCode } = this.props;
    verifyPasswordResetCode(oobCode);
  }
  render() {
    const {
      oobCode,
      passwordResetStatus,
      passwordResetErrors,
      targetEmail,
      onSubmit,
    } = this.props;
    const GoToLogin = (
      <div className={styles.login}>
        <FlatButton
          label="ログイン画面へ"
          secondary
          onClick={() => { history.replace('/sign-in'); }}
          icon={<FontIcon className="fa fa-sign-in" />}
        />
      </div>
    );
    return (
      <div>
        <Header />
        <Grid className={styles.wrapper}>
          <Row>
            <Col
              xsOffset={1} xs={10}
              smOffset={3} sm={6}
              mdOffset={3} md={6}
              className={styles.container}
            >
              <Paper className={styles.main}>
                <div className={styles.header}>
                  パスワードの再設定
                </div>
                <div className={styles.body}>
                  {passwordResetStatus === 'not_verified' ?
                    <div className={styles['not-verified']}>
                      <p>認証コードが無効です。</p>
                      <p>ログイン画面から再度再設定のメールを送信してください。</p>
                      {GoToLogin}
                    </div>
                    : null
                  }
                  {includes(['verified', 'resetting', 'errored'], passwordResetStatus) ?
                    <div>
                      <p>{targetEmail}</p>
                      <form onSubmit={(e) => { onSubmit(e, oobCode); }}>
                        <TextField
                          name="password"
                          hintText="新しいパスワード"
                          type="password"
                          errorText={passwordResetErrors.get('password')}
                        />
                        <div>
                          <RaisedButton
                            type="submit" className={styles.submit}
                            label="パスワードを変更"
                            primary
                            disabled={passwordResetStatus === 'resetting'}
                          />
                        </div>
                      </form>
                    </div>
                    : null
                  }
                  {passwordResetStatus === 'reset' ?
                    <div>
                      パスワードを変更しました。
                      <div>
                        {GoToLogin}
                      </div>
                    </div>
                    : null
                  }
                </div>
              </Paper>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  oobCode: PropTypes.string,
  verifyPasswordResetCode: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  passwordResetStatus: PropTypes.string,
  passwordResetErrors: PropTypes.object,
  targetEmail: PropTypes.string,
};

const mapStateToProps = createSelector(
  getEmailActionParams,
  getPasswordReset,
  ({ oobCode }, { targetEmail, passwordResetStatus, passwordResetErrors }) => ({
    oobCode, targetEmail, passwordResetStatus, passwordResetErrors,
  }),
);

const mapDispatchToProps = (dispatch) => ({
  verifyPasswordResetCode: (oobCode) => {
    dispatch(authActions.verifyPasswordResetCode(oobCode));
  },
  onSubmit: (e, oobCode) => {
    e.preventDefault();
    const password = e.target.password.value;
    dispatch(authActions.resetPassword({ password, oobCode }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
