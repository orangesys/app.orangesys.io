
import {
  isAuthenticated,
  needEmailVerification,
} from 'src/core/auth';
import App from './app';
import Home from './pages/home';
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';

import EmailVerification from './pages/email-verification';
import UITest from './pages/ui-test';

// import SignIn from './pages/sign-in';


export const paths = {
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  EMAIL_VELIFICATION: '/email-verification',
};

const requireAuth = getState => (
  (nextState, replace) => {
    // const needVerification = needEmailVerification(getState());
    if (needEmailVerification(getState())) {
      replace(paths.EMAIL_VELIFICATION);
      return;
    }
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
    }
  }
);

const shouldVerifyEmail = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    const needVerification = needEmailVerification(getState());
    if (!needVerification) {
      replace(paths.ROOT);
    }
  }
);

const requireUnauth = getState => (
  (nextState, replace) => {
    if (isAuthenticated(getState())) {
      replace(paths.ROOT);
    }
  }
);

export const getRoutes = getState => (
  {
    path: paths.ROOT,
    component: App,
    childRoutes: [
      {
        indexRoute: {
          component: Home,
          onEnter: requireAuth(getState),
        },
      },
      {
        path: paths.EMAIL_VELIFICATION,
        component: EmailVerification,
        onEnter: shouldVerifyEmail(getState),
      },
      {
        path: paths.SIGN_UP,
        component: SignUp,
        onEnter: requireUnauth(getState),
      },
      {
        path: paths.SIGN_IN,
        component: SignIn,
        onEnter: requireUnauth(getState),
      },
      {
        path: 'ui-test',
        component: UITest,
      },
    ],
  }
);
