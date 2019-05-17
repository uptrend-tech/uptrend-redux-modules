import {isObject} from '../../utils'

export default () => {
  const initialState = {}

  const getEntity = (state = initialState, entity) => {
    return state[entity] || {}
  }

  const getDetail = (state = initialState, entity, entityId) => {
    return getEntity(state, entity)[entityId]
  }

  const getList = (state = initialState, entity, entityIdList) => {
    const ids = entityIdList || Object.keys(getEntity(state, entity))
    const entityDetailList = ids.map(entityId =>
      getDetail(state, entity, entityId),
    )
    return entityDetailList.filter(isObject)
  }

  return {
    initialState,
    getEntity,
    getDetail,
    getList,
  }
}
