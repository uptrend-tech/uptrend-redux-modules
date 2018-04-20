import mergeWith from 'lodash/mergeWith'
import {ENTITIES_RECEIVE} from './actions'

const reducerFactory = ({initialState}) => {
  return (state = initialState, {type, payload}) => {
    if (type === ENTITIES_RECEIVE) {
      return mergeWith({}, state, payload, (objValue, srcValue) => {
        if (Array.isArray(srcValue)) {
          return srcValue
        }
        return undefined
      })
    }
    return state
  }
}

export default reducerFactory
