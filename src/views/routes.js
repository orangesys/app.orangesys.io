
import {
  isAuthenticated,
  needEmailVerification,
  needSetupPlan,
} from 'src/core/auth';
import { planSelected } from 'src/core/setup';
import App from './app';
import Home from './pages/home';
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';
import EmailVerification from './pages/email-verification';
import SetupPlan from './pages/setup/plan';
import SetupPayment from './pages/setup/payment';
import SetupComplete from './pages/setup/complete';
import UITest from './pages/ui-test';

export const paths = {
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  EMAIL_VELIFICATION: '/email-verification',
  SETUP_PLAN: '/setup/plan',
  SETUP_PAYMENT: '/setup/payment',
  SETUP_COMPLETE: '/setup/complete',
};

const requireAuth = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    if (needEmailVerification(getState())) {
      replace(paths.EMAIL_VELIFICATION);
      return;
    }
    if (needSetupPlan(getState())) {
      replace(paths.SETUP_PLAN);
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

const shouldSetupPlan = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    if (!needSetupPlan(getState())) {
      replace(paths.ROOT);
    }
  }
);

const canSetupPayment = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    if (!needSetupPlan(getState())) {
      replace(paths.ROOT);
      return;
    }
    if (!planSelected(getState())) {
      replace(paths.SETUP_PLAN);
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
        path: paths.SETUP_PLAN,
        component: SetupPlan,
        onEnter: shouldSetupPlan(getState),
      },
      {
        path: paths.SETUP_PAYMENT,
        component: SetupPayment,
        onEnter: canSetupPayment(getState),
      },
      {
        path: paths.SETUP_COMPLETE,
        component: SetupComplete,
        onEnter: !canSetupPayment(getState),
      },
      {
        path: 'ui-test',
        component: UITest,
      },
    ],
  }
);
