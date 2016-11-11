import { includes } from 'lodash/collection';

export const SERVER_SETUP_STATUS = {
  WAIT_STARTING: 'wait_starting',
  BUILDING: 'building',
  COMPLETED: 'completed',
  ERRORED: 'errored',
};

export const needServerSetup = (status) => (
  status && includes([
    SERVER_SETUP_STATUS.WAIT_STARTING,
    SERVER_SETUP_STATUS.BUILDING,
    SERVER_SETUP_STATUS.ERRORED,
  ], status)
);

export const isProcessing = (status) => (
  status && includes([
    SERVER_SETUP_STATUS.WAIT_STARTING,
    SERVER_SETUP_STATUS.BUILDING,
  ], status)
);

export const isErrored = (status) => (
  status && status === SERVER_SETUP_STATUS.ERRORED
);
