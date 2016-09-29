import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
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
import Snackbar from 'material-ui/Snackbar';

import { getSignIn, authActions } from 'src/core/auth';

import Header from '../../components/header-unauth';
import styles from './index.css';

const fieldNames = ['email', 'password'];

const SignIn = ({ signIn, onSubmit,
  onSignInWithGoogle, onSignInWithGithub }) => {
  const { signingIn, signInError } = signIn;
  return (
    <div>
      <Header />
      <Snackbar
        open={!!signInError}
        message={signInError || ''}
        autoHideDuration={5000}
        bodyStyle={{ backgroundColor: 'rgb(250, 100, 100)' }}
      />
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
              onClick={() => { history.replace('/sign-up'); }}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
