// https://github.com/diegohaz/arc/wiki/Selectors
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#entities
import t from 'tcomb';
import { denormalize } from 'normalizr';
// import * as schemas from './schemas';
import {
  EntityItemId,
  EntityItemList,
  EntityItem,
  EntityName,
  EntitySubState,
  EntitiesState,
} from '../types';

// --
// -- Local s
// --

const GetEntitySelector = t.func(
  [EntitiesState, EntityName],
  EntitySubState
);

// const GetDenormalizedListFn = t.func(
//   [],

// );

// --
// -- Selectors Implementation
// --

const selectorsFactory = ({ schemas = {} }) => {
  const initialState = {};

  const getEntity = GetEntitySelector.of(
    (state = initialState, entity) => {
      return state[entity] || {};
    }
  );

  const getEntityItem = t.func(
    [EntitiesState, EntityName, EntityItemId],
    t.maybe(EntityItem),
  ).of((state = initialState, entity, id) => {
    return getEntity(state, entity)[id];
  });

  const getEntityItemList = t.func(
    [EntitiesState, EntityName, t.list(EntityItemId)],
    EntityItemList
  ).of((state = initialState, entity, idList) => {
    const ids = idList || Object.keys(getEntity(state, entity));
    const entityItemList = ids.map(id => getEntityItem(state, entity, id));
    return entityItemList.filter(EntityItem.is);
  });

  // const getDenormalizedDetail = (state = initialState, entity, id) =>
  //   denormalize(getEntityItem(state, entity, id), schemas[entity], state);

  // const getDenormalizedList = (state = initialState, entity, ids) => {
  //   // t.Object(state);
  //   // t.String(entity);
  //   // t.Array(ids);

  //   // if (state === undefined) {
  //   // }

  //   return ids.map(id => getDenormalizedDetail(state, entity, id));

  //   const entityList = getEntityItemList(state, entity, ids);
  //   const schema = schemas[entity];

  //   console.log('ent:sel:getDenormalizedList', {
  //     state,
  //     entity,
  //     ids,
  //     entityList,
  //     schema,
  //     schemas,

  //   });
  //   return entityList;
  //   // const denormalizedList = denormalize(entityList, [schema], ids);
  //   // const denormalizedList = denormalize(entityList, [schema], state);
  //   console.warn('ent:sel:getDenormalizedList', {
  //     denormalizedList,
  //   });

  //   return denormalizedList;
  //   // console.log('gdl',{
  //   //   gl: getEntityItemList(state, entity, ids),
  //   //   state,
  //   //   entity,
  //   //   ids,
  //   //   schema: schemas[entity],
  //   // })
  //   // console.info(state)

  //   // return denormalize(getEntityItemList(state, entity, ids), [schemas[entity]], state);
  // }

  return {
    initialState,
    getEntity,
    getEntityItem,
    getEntityItemList,
    // getDenormalizedDetail,
    // getDenormalizedList,
  };
};

export default selectorsFactory;
