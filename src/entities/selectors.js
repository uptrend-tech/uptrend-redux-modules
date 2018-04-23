import t from 'tcomb'
import {denormalize} from 'normalizr'
import {
  EntityItemId,
  EntityItemList,
  EntityItem,
  EntityName,
  EntitySubState,
  EntitiesState,
} from '../types'

export default ({schemas}) => {
  const initialState = {}

  const getEntity = t
    .func([EntitiesState, EntityName], EntitySubState)
    .of((state = initialState, entity) => {
      return state[entity] || {}
    })

  const getDetail = t
    .func([EntitiesState, EntityName, EntityItemId], t.maybe(EntityItem))
    .of((state = initialState, entity, entityId) => {
      return getEntity(state, entity)[entityId]
    })

  const getList = t
    .func([EntitiesState, EntityName, t.list(EntityItemId)], EntityItemList)
    .of((state = initialState, entity, entityIdList) => {
      const ids = entityIdList || Object.keys(getEntity(state, entity))
      const entityDetailList = ids.map(entityId =>
        getDetail(state, entity, entityId),
      )
      return entityDetailList.filter(EntityItem.is)
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
    getEntity,
    getDetail,
    getList,
    getDenormalizedDetail,
    getDenormalizedList,
  }
}
