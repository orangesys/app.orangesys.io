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
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';

import ErrorSnackbar from 'src/views/components/error-snackbar';
import { getSignIn, authActions } from 'src/core/auth';

import Header from 'src/views/components/header-unauth';
import styles from './index.css';

const fieldNames = ['email', 'password'];

const SignIn = ({ signIn, onSubmit, onGoToSignUp,
  onSignInWithGoogle, onSignInWithGithub, onCloseMessage }) => {
  const { signingIn, signInError } = signIn;
  return (
    <div>
      <Header />
      <ErrorSnackbar error={signInError} onClose={onCloseMessage} />
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
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSignInWithGoogle: PropTypes.func.isRequired,
  onSignInWithGithub: PropTypes.func.isRequired,
  signIn: PropTypes.object.isRequired,
  onGoToSignUp: PropTypes.func.isRequired,
  onCloseMessage: PropTypes.func,
};

const getInputValues = (target) => (
  reduce(fieldNames, (o, key) => (
    Object.assign({}, o, { [key]: target[key].value.trim() })
  ), {})
);

const mapStateToProps = createSelector(
  getSignIn,
  (signIn) => ({ signIn }),
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
