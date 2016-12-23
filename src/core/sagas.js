import { authSagas } from './auth';
import { setupSagas } from './setup';
import { settingsSagas } from './settings';

export default function* sagas() {
  yield [
    ...authSagas,
    ...setupSagas,
    ...settingsSagas,
  ];
}
