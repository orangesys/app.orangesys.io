import { authSagas } from './auth';
import { setupSagas } from './setup';

export default function* sagas() {
  yield [
    ...authSagas,
    ...setupSagas,
  ];
}
