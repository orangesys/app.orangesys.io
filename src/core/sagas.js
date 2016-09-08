import { authSagas } from './auth';

export default function* sagas() {
  yield [
    ...authSagas,
  ];
}
