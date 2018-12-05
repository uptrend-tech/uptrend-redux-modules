import {dissocPath} from '../../utils/fp'
import {ENTITIES_RECEIVE, ENTITIES_REMOVE} from './actions'

/**
 * Returns new state object updated to include new/updated entity values in
 * payload.
 *
 * @arg {object} state Entities state
 * @arg {object} updates Entities updates
 * @returns {object} New state object updated to include entities from payload
 *
 */
const updateEntities = (state, updates) => {
  const newState = {...state}
  Object.keys(updates).forEach(entityType => {
    Object.keys(updates[entityType]).forEach(entityId => {
      newState[entityType] = {
        ...newState[entityType],
        [entityId]: updates[entityType][entityId],
      }
    })
  })
  return newState
}

const reducerFactory = ({initialState}) => {
  return (state = initialState, {type, payload}) => {
    if (type === ENTITIES_RECEIVE) {
      return updateEntities(state, payload)
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
