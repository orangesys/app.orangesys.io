import { firebaseAuth, firebaseDB } from 'src/core/firebase';
import * as authActions from './actions';

export {
  getAuth,
  isAuthenticated,
  getSignUp,
  getSignIn,
  needEmailVerification,
  getEmailVerification,
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
  }).then((user) => (
    new Promise((resolve) => {
      console.log("user:", user)
      unsub();
      if (!user) {
        resolve(user);
        return;
      }
      fetchUser(user.uid)
        .then((snapshot) => {
          const userDataExists = !!(snapshot.val());
          console.log("userDataExists:", userDataExists);
          const { providerId, emailVerified } = user;
          const payload = Object.assign({}, user, {
            needPaymentInformation: true,
            providerId,
            emailVerified,
            userDataExists,
          });
          resolve(payload);
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
