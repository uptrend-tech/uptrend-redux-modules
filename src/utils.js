import { call } from 'redux-saga/effects';
import { camelizeKeys, decamelizeKeys } from 'humps';

export { delay } from 'redux-saga';
// export const delay = (ms, val = true) =>
//   reduxSagaDelay(ms, val);

// --
// -- object key formating
// --

export const camelKeys = camelizeKeys;
export const snakeKeys = decamelizeKeys;

// --
// -- redux-saga helpers
// --

export const consoleErrorRecovery = (err, ...args) => {
  /* eslint-disable no-console */
  console.error('caught', err);
  console.log({ err, args });
  /* eslint-enable no-console */
};

export const safeSaga = recovery => (saga, ...args) =>
  // eslint-disable-next-line func-names
  function*(action) {
    try {
      yield call(saga, ...args, action);
    } catch (err) {
      yield call(recovery, err, ...args);
    }
  };
