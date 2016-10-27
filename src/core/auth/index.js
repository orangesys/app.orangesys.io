import { firebaseAuth, firebaseDB } from 'src/core/firebase';
import { isEmpty } from 'lodash/lang';

import * as authActions from './actions';

export {
  getAuth,
  isAuthenticated,
  getSignUp,
  getSignIn,
  needEmailVerification,
  getEmailVerificationParams,
  getEmailVerificationResult,
  needSetupPlan,
  getEmailVerification,
  getUid,
  getFieldsForPayment,
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
          // const userDataExists = !isEmpty(snapshotData);
          // const planId = snapshotData.planId || null;
          // const email = snapshotData.email || null;
          // const customerId = snapshotData.customerId || null;
          // const { providerId, emailVerified } = firebaseUser;
          const user = Object.assign(
            {}, firebaseUser, snapshotData, { userDataExists: !isEmpty(snapshotData) });
          // const payload = Object.assign({}, firebaseUser, {
          //   providerId,
          //   emailVerified,
          //   userDataExists,
          //   planId,
          //   email,
          //   customerId,
          // });
          console.log("user:", user)
          resolve(user);
        });
    })
  ));
}

export function initAuth(dispatch) {
  return fetchAuth()
    .then((user) => {
      dispatch(authActions.initAuth(user));
      return Promise.resolve();
    });
}
