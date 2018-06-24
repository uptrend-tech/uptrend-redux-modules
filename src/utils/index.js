import {BaseError} from 'make-error-cause'
import {call} from 'redux-saga/effects'
import {camelizeKeys, decamelizeKeys} from 'humps'

// --
// -- Async Helpers
// --

export {delay} from 'redux-saga'

// --
// -- Custom Errors
// --

export class RdxModEntitiesError extends BaseError {}

export class RdxModResourceError extends BaseError {}

// --
// -- object key formating
// --

export const isCamelSafe = str => /^[A-Za-z0-9_]+$/.test(str)
export const hasLodashPrefix = str => /^_/.test(str)

export const camelKeys = obj =>
  camelizeKeys(obj, (key, convert) => {
    if (!isCamelSafe(key) || hasLodashPrefix(key)) {
      return key
    }

    return convert(key)
  })

export const snakeKeys = obj =>
  decamelizeKeys(obj, (key, convert, options) => {
    if (!isCamelSafe(key) || hasLodashPrefix(key)) {
      return key
    }

    return convert(key, options)
  })

// --
// -- General Utils
// --

export const isObject = input => typeof input === 'object'

// --
// -- Selector State Helpers
// --

export const isolateSelectorsState = (storeName, selectors) => {
  const getState = (state = {}) => state[storeName] || {}

  const isolatedSelectors = {}

  Object.keys(selectors).forEach(name => {
    const selector = selectors[name]
    if (typeof selector === 'function') {
      isolatedSelectors[name] = (state, ...args) =>
        selector(getState(state), ...args)
    } else {
      isolatedSelectors[name] = selector
    }
  })

  return isolatedSelectors
}

// --
// -- redux-saga helpers
// --

export const consoleErrorRecovery = (err, ...args) => {
  /* eslint-disable no-console */
  console.error('caught', err)
  console.log({err, args})
  /* eslint-enable no-console */
}

export const safeSaga = recovery => (saga, ...args) =>
  // eslint-disable-next-line func-names
  function*(action) {
    try {
      yield call(saga, ...args, action)
    } catch (err) {
      yield call(recovery, err, ...args)
    }
  }
