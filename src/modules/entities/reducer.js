import mergeWith from 'lodash/mergeWith'
import {dissocPath} from '../../utils/fp'
import {ENTITIES_RECEIVE, ENTITIES_REMOVE} from './actions'

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

    if (type === ENTITIES_REMOVE) {
      const {entityType, entityIds} = payload
      if (entityType in state && Array.isArray(entityIds)) {
        return entityIds.reduce((acc, entityId) => {
          return dissocPath([entityType, entityId])(acc)
        }, state)
      }
    }

    return state
  }
}

export default reducerFactory
