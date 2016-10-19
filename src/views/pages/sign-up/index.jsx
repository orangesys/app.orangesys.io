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

import { getSignUp, authActions } from 'src/core/auth';

import Header from '../../components/header-unauth';
import styles from './index.css';

const fieldNames = ['companyName', 'fullName', 'email', 'password'];
const fieldNamesForOAuth = ['companyName', 'fullName', 'email'];


const submitLabel = {
  firebase: '登録',
  google: 'Googleアカウントで登録',
  github: 'Githubアカウントで登録',
};


const SignUp = ({ signUp, onChange, onBlur,
  onstartSigningUpWithGoogle, onstartSigningUpWithGithub,
  onSubmit, onSubmitWithGoogle, onSubmitWithGithub, onGoToSignIn }) => {
  const {
    signingUp,
    signUpFieldErrors,
    signingUpWithOAuth,
    signUpProvider,
    inputs,
  } = signUp;
  const submitHandler = {
    firebase: onSubmit,
    google: onSubmitWithGoogle,
    github: onSubmitWithGithub,
  };
  return (
    <div>
      <Header />
      <Grid className={styles.wrapper}>
        <Row className={styles['navigation-wrapper']}>
          <Col
            className={styles.navigation}
            xsOffset={1} xs={10}
            smOffset={1} sm={10}
            mdOffset={3} md={6}
          >
            <FlatButton
              label="既にアカウントをお持ちの方" secondary
              onClick={onGoToSignIn}
              icon={<FontIcon className="fa fa-sign-in" />}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xsOffset={1} xs={10}
            smOffset={4} sm={4}
            mdOffset={3} md={6}
            className={styles.container}
          >
            <Paper className={styles.main}>
              <form onSubmit={submitHandler[signUpProvider]}>
                <div className={styles.header}>
                  {signingUpWithOAuth ? '外部アカウントで登録' : '新規ユーザ登録'}
                </div>
                <div className={styles.body}>
                  <div className={styles['field-wrapper']}>
                    <TextField
                      name="companyName" hintText="会社名" fullWidth
                      errorText={signUpFieldErrors.get('companyName')}
                      onBlur={onBlur} onChange={onChange}
                      value={inputs.get('companyName')}
                    />
                  </div>
                  <div className={styles['field-wrapper']}>
                    <TextField
                      name="fullName" hintText="名前 (フルネーム)" fullWidth
                      errorText={signUpFieldErrors.get('fullName')}
                      onBlur={onBlur} onChange={onChange}
                      value={inputs.get('fullName')}
                    />
                  </div>
                  <div className={styles['field-wrapper']}>
                    <TextField
                      name="email" hintText="Email" fullWidth
                      errorText={signUpFieldErrors.get('email')}
                      onBlur={onBlur} onChange={onChange}
                      value={inputs.get('email')}
                      disabled={signingUpWithOAuth}
                    />
                  </div>
                  {signingUpWithOAuth ?
                    null :
                    <div className={styles['field-wrapper']}>
                      <TextField
                        type="password" name="password" hintText="パスワード" fullWidth
                        errorText={signUpFieldErrors.get('password')}
                        onBlur={onBlur} onChange={onChange}
                        value={inputs.get('password')}
                      />
                    </div>
                    }
                </div>
                <div className={styles.bottom}>
                  <div
                    style={{ visibility: signingUp ? '' : 'hidden' }}
                    className={styles.progress}
                  >
                    <LinearProgress />
                  </div>
                  <RaisedButton
                    type="submit" className={styles.regist}
                    label={submitLabel[signUpProvider]} primary fullWidth
                    disabled={signingUp}
                    icon={null}
                  />
                {signingUpWithOAuth ?
                  null :
                  <div>
                    <Divider />
                    <div className={styles['external-regist']}>
                      <div className={styles['external-regist-text']}>
                        外部アカウントで登録
                      </div>
                      <Row className={styles['oauth-buttons']}>
                        <Col xs={6} md={6}>
                          <RaisedButton
                            className="regist" label="Google" fullWidth
                            icon={<FontIcon className="fa fa-google" />}
                            onClick={onstartSigningUpWithGoogle}
                          />
                        </Col>
                        <Col xs={6} md={6}>
                          <RaisedButton
                            className="regist" label="Github" fullWidth
                            icon={<FontIcon className="fa fa-github" />}
                            onClick={onstartSigningUpWithGithub}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                }
                </div>
              </form>
            </Paper>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onstartSigningUpWithGoogle: PropTypes.func.isRequired,
  onstartSigningUpWithGithub: PropTypes.func.isRequired,
  onSubmitWithGoogle: PropTypes.func.isRequired,
  onSubmitWithGithub: PropTypes.func.isRequired,
  onGoToSignIn: PropTypes.func.isRequired,
  signUp: PropTypes.object.isRequired,
};

const getInputValues = (fields, target) => (
  reduce(fields, (o, key) => (
    Object.assign({}, o, { [key]: target[key].value.trim() })
  ), {})
);

const mapStateToProps = createSelector(
  getSignUp,
  (signUp) => ({ signUp }),
);

const mapDispatchToProps = (dispatch) => ({
  onChange: (e) => {
    const { name, value } = e.target;
    dispatch(authActions.changeSignUpField({ [name]: value }));
  },
  onBlur: (e) => {
    e.preventDefault();
    const name = e.target.name;
    const inputs = { [name]: e.target.value.trim() };
    dispatch(authActions.validateSignUp(inputs));
  },
  onstartSigningUpWithGoogle: () => {
    dispatch(authActions.startSigningUpWithGoogle());
  },
  onstartSigningUpWithGithub: () => {
    dispatch(authActions.startSigningUpWithGithub());
  },
  onSubmit: (e) => {
    e.preventDefault();
    const inputs = getInputValues(fieldNames, e.target);
    dispatch(authActions.signUp(inputs));
  },
  onSubmitWithGoogle: (e) => {
    e.preventDefault();
    const inputs = getInputValues(fieldNamesForOAuth, e.target);
    dispatch(authActions.signUpWithGoogle(inputs));
  },
  onSubmitWithGithub: (e) => {
    e.preventDefault();
    const inputs = getInputValues(fieldNamesForOAuth, e.target);
    dispatch(authActions.signUpWithGithub(inputs));
  },
  onGoToSignIn: () => {
    dispatch(authActions.goToSignIn());
    history.replace('/sign-in');
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
