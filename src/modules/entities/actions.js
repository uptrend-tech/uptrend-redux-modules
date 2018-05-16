export const ENTITIES_RECEIVE = 'ENTITIES_RECEIVE'
export const ENTITIES_REMOVE = 'ENTITIES_REMOVE'

export const entitiesReceive = entities => ({
  type: ENTITIES_RECEIVE,
  payload: entities,
})

export const entitiesRemove = (entityType, entityIds) => ({
  type: ENTITIES_REMOVE,
  payload: {
    entityIds,
    entityType,
  },
})
