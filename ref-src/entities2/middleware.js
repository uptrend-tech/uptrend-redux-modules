// https://github.com/diegohaz/arc/wiki/Example-redux-modules#entities
import { normalize } from 'normalizr';
import { isDevEnv } from 'rides/config';
import { entitiesReceive } from './actions';
import * as schemas from './schemas';

const middleware = store => next => action => {
  const { payload, meta } = action;

  if (meta && meta.normalizeEntities && meta.entityType) {
    const schema = schemas[meta.entityType]; // eslint-disable-line import/namespace

    if (schema) {
      const { result, entities } = normalize(
        payload.data,
        Array.isArray(payload.data) ? [schema] : schema,
      );

      store.dispatch(entitiesReceive(entities));

      return next({ ...action, payload: { ...payload, data: result } });
    }

    // istanbul ignore next
    if (isDevEnv) {
      // eslint-disable-next-line no-console
      console.warn(`[entityType] There is no ${meta.entityType} schema on schemas.js`);
    }
  }

  return next(action);
};

export default middleware;
