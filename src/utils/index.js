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
// -- General Utils
// --

export const alwaysFn = val => () => val

export const alwaysNull = alwaysFn(null)

export const isObject = input => typeof input === 'object'

// --
// -- object key formating
// --

export const hasDashes = str => str.includes('-')
export const hasLodashPrefix = str => str.startsWith('_')

export const createCamelKeys = (customPred = alwaysNull) => obj =>
  // eslint-disable-next-line complexity
  camelizeKeys(obj, (key, convert) => {
    const isSafe = !hasDashes(key) && !hasLodashPrefix(key)
    const pred = customPred(key, obj, isSafe)

    // Custom Key (the pred value) when pred is `string`
    if (typeof pred === 'string') return pred

    // Original Key when pred is `false`
    if (pred === false) return key

    // Converted Key when pred is `true`
    if (pred === true || isSafe) return convert(key)

    // Otherwise use original key
    return key
  })

export const createSnakeKeys = (customPred = alwaysNull) => obj =>
  // eslint-disable-next-line complexity
  decamelizeKeys(obj, (key, convert, options) => {
    const isSafe = !hasDashes(key) && !hasLodashPrefix(key)
    const pred = customPred(key, obj, isSafe)

    // Custom Key (the pred value) when pred is `string`
    if (typeof pred === 'string') return pred

    // Original Key when pred is `false`
    if (pred === false) return key

    // Converted Key when pred is `true`
    if (pred === true || isSafe) return convert(key, options)

    // Otherwise use original key
    return key
  })

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
