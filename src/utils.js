import { call, delay, put } from 'redux-saga/effects';
import { camelizeKeys, decamelizeKeys } from 'humps';

// --
// -- object key formating
// --

export const camelKeys = camelizeKeys;
export const snakeKeys = decamelizeKeys;

// --
// -- redux-saga helpers
// --

export const consoleErrorRecovery = (err, ...args) => {
  console.error('caught', err);
  console.log({ err, args });
};

export const safeSaga = recovery => (saga, ...args) =>
  function*(action) {
    try {
      yield call(saga, ...args, action);
    } catch (err) {
      yield call(recovery, err, ...args);
    }
  };
