import { createReducer } from 'redux-act';
import { Record, Map } from 'immutable';
import { isEmpty } from 'lodash/lang';

import {
  initAuth,
  validateSignUp,
  changeSignUpField,
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
  clearMessage,
} from './actions';
import * as validators from './validator';

const AuthState = new Record({
  authenticated: false,
  uid: null,
  email: null,
  planId: null,
  customerId: null,
  signingUp: false,
  signUpInputs: new Map({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
  }),
  signUpFieldErrors: new Map(),
  signUpError: null,
  signingUpWithOAuth: false,
  signUpProvider: 'firebase',
  sendingVerificationEmail: false,
  sentVerificationEmail: false,
  signingIn: false,
  signInError: null,
  needEmailVerification: false,
  emailVerificationResult: 0,
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
      signingIn: false,
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
  [clearMessage]: (state) => (
    state.merge({
      signInError: null,
      signUpError: null,
    })
  ),
}, new AuthState());
