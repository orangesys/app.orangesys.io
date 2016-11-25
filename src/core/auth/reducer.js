import { createReducer } from 'redux-act';
import { Record, Map } from 'immutable';
import { isEmpty } from 'lodash/lang';

import {
  initAuth,
  validateSignUp,
  changeSignUpField,
  serverSetupError,
  signUpValidationFailed,
  signUp,
  signUpFulfilled,
  signUpFailed,
  finishConnectingToGoogleForSignUp,
  finishConnectingToGithubForSignUp,
  signIn,
  signInFulfilled,
  signInFailed,
  signOut,
  emailVerification,
  emailVerificationSent,
  verifyEmailFinished,
  verifyEmailFailed,
  goToSignUp,
  // goToSignIn,
  paymentFulfilled,
  putTelegraf,
  serverSetupFinished,
  clearMessage,
} from './actions';
import * as validators from './validator';
import { SERVER_SETUP_STATUS } from 'src/core/server_setup';

const AuthState = new Record({
  authenticated: false,
  customerId: null,
  email: null,
  emailVerificationResult: 0,
  needEmailVerification: false,
  planId: null,
  sendingVerificationEmail: false,
  sentVerificationEmail: false,
  serverSetup: new Map(),
  signInError: null,
  signingIn: false,
  signingUp: false,
  signingUpWithOAuth: false,
  signUpError: null,
  signUpFieldErrors: new Map(),
  signUpInputs: new Map({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
  }),
  signUpProvider: 'firebase',
  telegraf: new Map(),
  uid: null,
});

export const authReducer = createReducer({
  [initAuth]: (state, user) => {
    const u = user || {};
    return state.merge({
      authenticated: !isEmpty(u) && u.userDataExists,
      uid: u.uid,
      email: u.email,
      needEmailVerification: !u.emailVerified,
      planId: u.planId,
      sentVerificationEmail: false,
      serverSetup: u.serverSetup,
      telegraf: u.telegraf,
    });
  },
  [changeSignUpField]: (state, input) => (
    state.merge({ signUpInputs: state.signUpInputs.merge(input) })
  ),
  [validateSignUp]: (state, inputs) => (
    state.merge({
      signUpFieldErrors: validators.validateSignUp(inputs),
    })
  ),
  [signUpValidationFailed]: (state, signUpFieldErrors) => (
    state.merge({
      signingUp: false,
      signUpFieldErrors,
    })
  ),
  [signUp]: (state) => (
    state.merge({
      signingUp: true,
    })
  ),
  [signUpFulfilled]: (state, user) => (
    state.merge({
      authenticated: true,
      signingUp: false,
      signUpFieldErrors: new Map(),
      signingUpWithOAuth: false,
      needEmailVerification: user.providerId === 'firebase' && !user.emailVerified,
      uid: user.uid,
      email: user.email,
      planId: user.planId,
    })
  ),
  [finishConnectingToGoogleForSignUp]: (state, user) => (
    state.merge({
      signingUpWithOAuth: true,
      signUpProvider: 'google',
      signUpInputs: state.signUpInputs.merge({
        companyName: '',
        fullName: user.displayName,
        email: user.email,
        password: '',
      }),
    })
  ),
  [finishConnectingToGithubForSignUp]: (state, user) => (
    state.merge({
      signingUpWithOAuth: true,
      signUpProvider: 'github',
      signUpInputs: state.signUpInputs.merge({
        companyName: '',
        fullName: '',
        email: user.email,
        password: '',
      }),
    })
  ),
  [putTelegraf]: (state, telegraf) => (
    state.merge({ telegraf })
  ),
  [signInFulfilled]: (state, user) => {
    const u = user || {};
    return state.merge({
      authenticated: true,
      uid: u.uid,
      email: u.email,
      needEmailVerification: u.providerId === 'firebase' && !u.emailVerified,
      planId: u.planId,
      customerId: u.customerId,
      sentVerificationEmail: false,
      serverSetup: u.serverSetup,
      signingIn: false,
      telegraf: u.telegraf,
    });
  },
  [signUpFailed]: (state, signUpError) => (
    state.merge({
      signingUp: false,
      signUpFieldErrors: new Map({ email: signUpError }),
    })
  ),
  [signIn]: (state) => (
    state.merge({
      signingIn: true,
    })
  ),
  [signInFailed]: (state, signInError) => (
    state.merge({
      signingIn: false,
      signInError,
    })
  ),
  [signOut]: (state) => (
    state.merge({ authenticated: false })
  ),
  [emailVerification]: (state) => (
    state.merge({ sendingVerificationEmail: true })
  ),
  [emailVerificationSent]: (state) => (
    state.merge({
      sendingVerificationEmail: false,
      sentVerificationEmail: true,
    })
  ),
  [verifyEmailFinished]: (state) => (
    state.merge({
      emailVerificationResult: 1,
    })
  ),
  [verifyEmailFailed]: (state) => (
    state.merge({
      emailVerificationResult: -1,
    })
  ),
  [goToSignUp]: (state) => (
    state.merge({
      signUpInputs: new Map({
        companyName: '',
        fullName: '',
        email: '',
        password: '',
      }),
    })
  ),
  [paymentFulfilled]: (state, { customerId, planId }) => (
    state.merge({
      customerId,
      planId,
    })
  ),
  [serverSetupError]: (state, { errorCode }) => (
    state.merge({
      serverSetup: {
        status: SERVER_SETUP_STATUS.ERRORED,
        errorCode,
      },
    })
  ),
  [serverSetupFinished]: (state) => (
    state.merge({ serverSetup: { status: SERVER_SETUP_STATUS.COMPLETED } })
  ),
  [clearMessage]: (state) => (
    state.merge({
      signInError: null,
      signUpError: null,
    })
  ),
}, new AuthState());
