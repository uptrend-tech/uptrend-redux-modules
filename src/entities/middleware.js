import {normalize} from 'normalizr'
import {entitiesReceive} from './actions'

const middlewareFactory = ({isDevEnv = false, schemas = {}}) => {
  // eslint-disable-next-line complexity
  const middleware = store => next => action => {
    const {payload, meta} = action

    if (meta && meta.normalizeEntities && meta.entityType) {
      const schema = schemas[meta.entityType]

      if (schema) {
        const {result, entities} = normalize(
          payload.data,
          Array.isArray(payload.data) ? [schema] : schema,
        )
        store.dispatch(entitiesReceive(entities))
        return next({...action, payload: {...payload, entities: result}})
      }

      if (isDevEnv) {
        // eslint-disable-next-line no-console
        console.warn(
          `[entityType] There is no ${meta.entityType} schema on schemas.js`,
        )
      }
    }

    return next(action)
  }

  return middleware
}

export default middlewareFactory
