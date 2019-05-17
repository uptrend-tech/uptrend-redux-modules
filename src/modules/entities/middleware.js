import warning from 'warning'
import {normalize} from 'normalizr'
import {entitiesReceive, entitiesRemove} from './actions'

const middlewareFactory = ({isDevEnv = false, schemas = {}}) => {
  // eslint-disable-next-line complexity
  const middleware = store => next => action => {
    const {payload, meta} = action

    // --
    // -- NORMALIZING ENTITIES
    // --
    if (
      payload &&
      payload.data &&
      meta &&
      meta.normalizeEntities &&
      meta.entityType
    ) {
      const schema = schemas[meta.entityType]

      if (schema) {
        const {result, entities} = normalize(
          payload.data,
          Array.isArray(payload.data) ? [schema] : schema,
        )
        store.dispatch(entitiesReceive(entities))
        return next({...action, payload: {...payload, entities: result}})
      }

      /* istanbul ignore next */
      warning(
        isDevEnv,
        `[entityType] There is no ${meta.entityType} schema on schemas.js`,
      )
    }

    // --
    // -- REMOVING ENTITIES
    // --
    const needle = meta && meta.request && meta.request.needle
    const entityType = meta && meta.entityType
    const removeEntities = meta && meta.removeEntities
    if (removeEntities && entityType && needle) {
      store.dispatch(entitiesRemove(entityType, [needle]))
    }

    return next(action)
  }

  return middleware
}

export default middlewareFactory
