
import {
  isAuthenticated,
  needEmailVerification,
  needSetupPlan,
  isNeedServerSetup,
} from 'src/core/auth';
import { planSelected } from 'src/core/setup';
import App from './app';
import DashboardParent from 'src/views/pages/dashboard/parent';
import Home from 'src/views/pages/home';
import SignUp from 'src/views/pages/sign-up';
import SignIn from 'src/views/pages/sign-in';

import VerificationGuide from 'src/views/pages/verification-guide';
import EmailAction from 'src/views/pages/email-action';
import VerifyEmail from 'src/views/pages/verify-email';
import ResetPassword from 'src/views/pages/reset-password';

import SetupPlan from 'src/views/pages/setup/plan';
import SetupPayment from 'src/views/pages/setup/payment';
import ServerSetup from 'src/views/pages/dashboard/server-setup';
import SetupComplete from 'src/views/pages/setup/complete';
import Plan from 'src/views/pages/dashboard/plan';
import Grafana from 'src/views/pages/dashboard/grafana';
import InfluxDB from 'src/views/pages/dashboard/influxdb';
import Settings from 'src/views/pages/dashboard/settings';

import UITest from './pages/ui-test';

export const paths = {
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  VERIFICATION_GUIDE: '/verification-guide',
  EMAIL_ACTION: '/email-action',
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',
  SETUP_PLAN: '/setup/plan',
  SETUP_PAYMENT: '/setup/payment',
  SETUP_SERVER: '/setup/server',
  SETUP_COMPLETE: '/setup/complete',
  DASHBOARD: '/dashboard',
  DASHBOARD_SERVER_SETUP: 'server-setup',
  DASHBOARD_PLAN: 'plan',
  DASHBOARD_GRAFANA: 'grafana',
  DASHBOARD_INFLUXDB: 'influxdb',
  Settings: 'settings',
};

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

const onEnterServerSetup = getState => (
  (nextState, replace) => {
    if (!isNeedServerSetup(getState())) {
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

const checkRequirement = (getState, replace) => {
  if (!isAuthenticated(getState())) {
    replace(paths.SIGN_IN);
    return false;
  }
  if (needEmailVerification(getState())) {
    replace(paths.VERIFICATION_GUIDE);
    return false;
  }
  if (needSetupPlan(getState())) {
    replace(paths.SETUP_PLAN);
    return false;
  }
  return true;
};

const onEnterHome = getState => (
  (nextState, replace) => {
    if (!checkRequirement(getState, replace)) {
      return;
    }
    if (isNeedServerSetup(getState())) {
      replace('/dashboard/server-setup');
      return;
    }
    replace(paths.DASHBOARD);
  }
);

const onEnterDashboard = getState => (
  (nextState, replace) => {
    if (!checkRequirement(getState, replace, nextState)) {
      return;
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
          onEnter: onEnterHome(getState),
        },
      },
      {
        path: paths.VERIFICATION_GUIDE,
        component: VerificationGuide,
        onEnter: shouldVerifyEmail(getState),
      },
      {
        path: paths.EMAIL_ACTION,
        component: EmailAction,
      },
      {
        path: paths.VERIFY_EMAIL,
        component: VerifyEmail,
        onEnter: shouldVerifyEmail(getState),
      },
      {
        path: paths.RESET_PASSWORD,
        component: ResetPassword,
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
        path: paths.DASHBOARD,
        component: DashboardParent,
        onEnter: onEnterDashboard(getState),
        childRoutes: [
          {
            indexRoute: {
              component: Plan,
            },
          },
          {
            path: paths.DASHBOARD_GRAFANA,
            component: Grafana,
          },
          {
            path: paths.DASHBOARD_INFLUXDB,
            component: InfluxDB,
          },
          {
            path: paths.DASHBOARD_SERVER_SETUP,
            component: ServerSetup,
            onEnter: onEnterServerSetup(getState),
          },
          {
            path: paths.Settings,
            component: Settings,
          },
        ],
      },

      {
        path: 'ui-test',
        component: UITest,
      },
    ],
  }
);
