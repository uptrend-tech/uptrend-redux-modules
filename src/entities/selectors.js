import t from 'tcomb'
import {denormalize} from 'normalizr'
import {isolateSelectorsState} from '../utils'
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

const selectorsFactory = ({schemas, storeName = 'entities'}) => {
  const initialState = {}

  const getEntity = t
    .func([EntitiesState, EntityName], EntitySubState)
    .of((state = initialState, entity) => {
      return state[entity] || {}
    })

  const getEntityItem = t
    .func([EntitiesState, EntityName, EntityItemId], t.maybe(EntityItem))
    .of((state = initialState, entity, entityId) => {
      return getEntity(state, entity)[entityId]
    })

  const getEntityItemList = t
    .func([EntitiesState, EntityName, t.list(EntityItemId)], EntityItemList)
    .of((state = initialState, entity, entityIdList) => {
      const ids = entityIdList || Object.keys(getEntity(state, entity))
      const entityItemList = ids.map(entityId =>
        getEntityItem(state, entity, entityId),
      )
      return entityItemList.filter(EntityItem.is)
    })

  const getDenormalizedDetail = t
    .func([EntitiesState, EntityName, EntityItemId], EntityItem)
    .of((state = initialState, entity, entityId) => {
      return denormalize({[entity]: entityId}, schemas[entity], state)
    })

  const getDenormalizedList = t
    .func([EntitiesState, EntityName, t.list(EntityItemId)], EntityItemList)
    .of((state = initialState, entity, entityIdList) => {
      const schema = schemas[entity]
      return denormalize({[entity]: entityIdList}, [schema], state)
    })

  return {
    initialState,
    ...isolateSelectorsState(storeName, {
      getEntity,
      getEntityItem,
      getEntityItemList,
      getDenormalizedDetail,
      getDenormalizedList,
    }),
  }
}

export default selectorsFactory
