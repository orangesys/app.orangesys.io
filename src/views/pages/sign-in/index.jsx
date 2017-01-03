import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory as history } from 'react-router';
import { createSelector } from 'reselect';
import { reduce } from 'lodash/collection';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import PasswordResetIcon from 'material-ui/svg-icons/content/mail';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';

import Message from 'src/views/components/snackbar/message';
import ErrorMessage from 'src/views/components/snackbar/error-message';
import { getSignIn, getPasswordReset, getMessage, authActions } from 'src/core/auth';
import Header from 'src/views/components/header-unauth';
import PasswordReset from './password-reset';
import styles from './index.css';

const fieldNames = ['email', 'password'];

const SignIn = (props) => {
  const {
    signIn,
    onSubmit,
    onGoToSignUp,
    onSignInWithGoogle,
    onSignInWithGithub,
    onCloseMessage,
    onShowPasswordReset,
    showingPasswordReset,
    sendingPasswordResetMail,
    onCancelPasswordReset,
    onSendPasswordResetMail,
    passwordResetErrors,
    message,
    errorMessage,
  } = props;

  const { signingIn, signInError } = signIn;
  return (
    <div>
      <Header />
      <Message message={message} onClose={onCloseMessage} />
      <ErrorMessage error={signInError} onClose={onCloseMessage} />
      <ErrorMessage error={errorMessage} onClose={onCloseMessage} />
      <Grid className={styles.wrapper}>
        <Row className={styles['navigation-wrapper']}>
          <Col
            className={styles.navigation}
            xsOffset={1} xs={10}
            smOffset={1} sm={10}
            mdOffset={3} md={6}
          >
            <FlatButton
              label="新規ユーザ登録へ" secondary
              onClick={onGoToSignUp}
              icon={<FontIcon className="fa fa-user" />}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xsOffset={1} xs={10}
            smOffset={2} sm={8}
            mdOffset={3} md={6}
          >
            <Paper className={styles.main}>
              <form onSubmit={onSubmit}>
                <div className={styles.header}>
                  ログイン
                </div>
                <div className={styles.body}>
                  <div className={styles['field-wrapper']}>
                    <TextField
                      name="email" hintText="メールアドレス" fullWidth
                    />
                  </div>
                  <div className={styles['field-wrapper']}>
                    <TextField
                      name="password" type="password" hintText="パスワード" fullWidth
                    />
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div
                    style={{ visibility: signingIn ? '' : 'hidden' }}
                    className={styles.progress}
                  >
                    <LinearProgress />
                  </div>
                  <div>
                    <RaisedButton
                      type="submit" className={styles.login}
                      label="メールアドレスでログイン" primary fullWidth
                      icon={null}
                      disabled={signingIn}
                    />
                  </div>
                  <Divider />
                  <div className={styles['external-regist']}>
                    <div className={styles['external-regist-text']}>
                      外部アカウントでログイン
                    </div>
                    <Row className={styles['oauth-buttons']}>
                      <Col xs={6} md={6}>
                        <RaisedButton
                          className="regist" label="Google" fullWidth
                          icon={<FontIcon className="fa fa-google" />}
                          onClick={onSignInWithGoogle}
                        />
                      </Col>
                      <Col xs={6} md={6}>
                        <RaisedButton
                          className="regist" label="Github" fullWidth
                          icon={<FontIcon className="fa fa-github" />}
                          onClick={onSignInWithGithub}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </form>
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col
            className={styles['bottom-navi']}
            xsOffset={1} xs={10}
            smOffset={1} sm={10}
            mdOffset={3} md={6}
          >
            <FlatButton
              label="パスワード再設定"
              secondary
              onClick={onShowPasswordReset}
              icon={<PasswordResetIcon />}
            />
          </Col>
        </Row>
      </Grid>
      <PasswordReset
        open={showingPasswordReset}
        submitting={sendingPasswordResetMail}
        onCancel={onCancelPasswordReset}
        onSubmit={onSendPasswordResetMail}
        errors={passwordResetErrors}
      />
    </div>
  );
};

SignIn.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSignInWithGoogle: PropTypes.func.isRequired,
  onSignInWithGithub: PropTypes.func.isRequired,
  signIn: PropTypes.object.isRequired,
  onGoToSignUp: PropTypes.func.isRequired,
  onCloseMessage: PropTypes.func.isRequired,
  onShowPasswordReset: PropTypes.func.isRequired,
  showingPasswordReset: PropTypes.bool,
  sendingPasswordResetMail: PropTypes.bool,
  onCancelPasswordReset: PropTypes.func.isRequired,
  onSendPasswordResetMail: PropTypes.func.isRequired,
  passwordResetErrors: PropTypes.object,
  message: PropTypes.string,
  errorMessage: PropTypes.string,
};

const getInputValues = (target) => (
  reduce(fieldNames, (o, key) => (
    Object.assign({}, o, { [key]: target[key].value.trim() })
  ), {})
);

const mapStateToProps = createSelector(
  getSignIn,
  getMessage,
  getPasswordReset,
  (signIn, { message, errorMessage }, {
    showingPasswordReset, sendingPasswordResetMail, passwordResetErrors,
  }) => ({
    signIn, message, errorMessage, showingPasswordReset,
    sendingPasswordResetMail, passwordResetErrors,
  }),
);

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (e) => {
    e.preventDefault();
    const inputs = getInputValues(e.target);
    dispatch(authActions.signIn(inputs));
  },
  onSignInWithGoogle: () => {
    dispatch(authActions.signInWithGoogle());
  },
  onSignInWithGithub: () => {
    dispatch(authActions.signInWithGithub());
  },
  onGoToSignUp: () => {
    dispatch(authActions.goToSignUp());
    history.replace('/sign-up');
  },
  onCloseMessage: () => {
    dispatch(authActions.clearMessage());
  },
  onShowPasswordReset: () => {
    dispatch(authActions.showPasswordReset());
  },
  onCancelPasswordReset: () => {
    dispatch(authActions.cancelPasswordReset());
  },
  onSendPasswordResetMail: (email) => {
    dispatch(authActions.sendPasswordResetMail({ email }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
