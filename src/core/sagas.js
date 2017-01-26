import { authSagas } from './auth';
import { setupSagas } from './setup';
import { settingsSagas } from './settings';
import { dashboardSagas } from './dashboard';

export default function* sagas() {
  yield [
    ...authSagas,
    ...setupSagas,
    ...settingsSagas,
    ...dashboardSagas,
  ];
}
