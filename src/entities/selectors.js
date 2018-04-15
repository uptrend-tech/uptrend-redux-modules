import t from 'tcomb'
import {
  EntityItemId,
  EntityItemList,
  EntityItem,
  EntityName,
  EntitySubState,
  EntitiesState,
} from '../types'

// --
// -- Selectors Implementation
// --

const selectorsFactory = (
  // eslint-disable-next-line no-empty-pattern
  {
    /* schemas = {} */
  },
) => {
  const initialState = {}

  const getEntity = t
    .func([EntitiesState, EntityName], EntitySubState)
    .of((state = initialState, entity) => {
      return state[entity] || {}
    })

  const getEntityItem = t
    .func([EntitiesState, EntityName, EntityItemId], t.maybe(EntityItem))
    .of((state = initialState, entity, id) => {
      return getEntity(state, entity)[id]
    })

  const getEntityItemList = t
    .func([EntitiesState, EntityName, t.list(EntityItemId)], EntityItemList)
    .of((state = initialState, entity, idList) => {
      const ids = idList || Object.keys(getEntity(state, entity))
      const entityItemList = ids.map(id => getEntityItem(state, entity, id))
      return entityItemList.filter(EntityItem.is)
    })

  return {
    initialState,
    getEntity,
    getEntityItem,
    getEntityItemList,
  }
}

export default selectorsFactory
