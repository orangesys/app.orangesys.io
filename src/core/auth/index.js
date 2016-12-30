import { firebaseAuth, firebaseDB } from 'src/core/firebase';
import { isEmpty } from 'lodash/lang';

import * as authActions from './actions';

export {
  isAuthenticated,
  isNeedServerSetup,
  getAuth,
  getEmailVerification,
  getEmailVerificationParams,
  getEmailVerificationResult,
  getFieldsForPayment,
  getPlanId,
  getProfile,
  getServerSetup,
  getServerSetupStatus,
  getSignUp,
  getSignIn,
  getPasswordReset,
  getTelegraf,
  getUid,
  needEmailVerification,
  needSetupPlan,
  updateProfile,
} from './selectors';

export { authActions };
export { authReducer } from './reducer';
export { authSagas } from './sagas';

export function fetchUser(uid) {
  return firebaseDB.ref(`users/${uid}`).once('value')
      .then((snapshot) => (Promise.resolve(snapshot)));
}

export function fetchAuth() {
  let unsub = null;
  return new Promise((resolve, reject) => {
    unsub = firebaseAuth.onAuthStateChanged(
      (user) => {
        resolve(user);
      },
      error => {
        unsub();
        reject(error);
      }
    );
  }).then((firebaseUser) => (
    new Promise((resolve) => {
      unsub();
      if (!firebaseUser) {
        resolve({});
        return;
      }
      fetchUser(firebaseUser.uid)
        .then((snapshot) => {
          const snapshotData = snapshot.val() || {};
          const user = Object.assign(
            {}, firebaseUser, snapshotData, { userDataExists: !isEmpty(snapshotData) });
          resolve(user);
        });
    })
  ));
}

export function executeFetchAuth() {
  return fetchAuth()
    .then(user => ({ user }))
    .catch(error => ({ error }));
}


export function initAuth(dispatch) {
  return fetchAuth()
    .then((user) => {
      dispatch(authActions.initAuth(user));
      return Promise.resolve();
    });
}
