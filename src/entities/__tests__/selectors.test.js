// https://github.com/diegohaz/arc/wiki/Selectors#unit-testing-selectors
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#entities
// import { 
//   k.asciiString,
//   k.boolean,
//   k.check, 
//   k.integer, 
//   k.oneOf,
//   k.string,
// } from 'kitimat-jest';
import t from 'tcomb';
import * as k from 'kitimat-jest';
import { schema } from 'normalizr';

import selectorsFactory from '../selectors';
import {
  EntityItemId,
  EntityItemList,
  EntityItem,
  EntityName,
  EntitySubState,
  EntitiesState,
} from '../../types';

const schemas = {
  entity: new schema.Entity('entity'),
};

const selectors = selectorsFactory({ schemas });

const altState = {
  entity: {
    1: {
      id: 1,
      title: 'test',
      description: 'test',
    },
    2: {
      id: 2,
      title: 'test 2',
      description: 'test 2',
    },
  },
};

// --
// -- Mock Data Generators
// --

// const GetEntitySelector = t.func(
//   [State, EntityName],
//   EntitySubState
// );

// const GetEntityItemSelector = t.func(
//   [State, EntityName, EntityItemId],
//   EntityItem
// );

// const GetEntityItemListSelector = t.func(
//   [State, EntityName, t.list(EntityItemId)],
//   EntityItemList
// );

const genEntityItem = t.func(
  [EntityItemId, t.Any],
  EntityItem
).of((id, data) => ({ id, data }));

const genEntityState = t.func(
  [EntityItemList],
  EntitySubState,
).of((entityItemList) => {
  const obj = {};
  const addItem = item => { obj[item.id] = item; }
  entityItemList.forEach(addItem);
  return obj;
});

const genState = t.func(
  [EntityName, EntityItemList],
  EntitiesState,
).of((entity, entityItemList) => {
  return { [entity]: genEntityState(entityItemList) };
});

// const genState = (entity, entityItemList) =>
//   ({ [entity]: genEntityState(entityItemList) });

const genEntityItemMockData = (entity, id, data) => {
  const entityItem = genEntityItem(id, data);
  const entityItemList = [entityItem];

    console.log({
    entity, 
    entityItemId: id,
    entityItemData: data,
    entityItem,
        entityItemList,
    })
  return {
    entity, 
    entityItemId: id,
    entityItemData: data,
    entityItem,
    entityState: genEntityState(entityItemList),
    state: genState(entity, entityItemList),
  }
};

// --
// -- Fuzzers
// --

const genStringFuzzer = (prefix, maxLen = 30) => 
  k.asciiString(maxLen).map(str => `${prefix}${str}`); 

const entityNameFuzzer = k.oneOf([genStringFuzzer('entity:'), k.posInteger()]);
const entityItemIdFuzzer = k.oneOf([genStringFuzzer(1), k.posInteger()]);
const entityItemDataFuzzer = k.oneOf([k.asciiString(), k.boolean(), k.integer()]);

const getEntityItemDataFuzzer = k.object({
  entity: entityNameFuzzer, 
  id: entityItemIdFuzzer, 
  data: entityItemDataFuzzer, 
});

test('initialState', () => {
  expect(selectors.initialState).toEqual({});
});

describe('getEntity', () => {
  test('throws on bad arguments', () => {
    expect(() => selectors.getEntity()).toThrow();
    expect(() => selectors.getEntity(undefined, 'entity')).toThrow();
    expect(() => selectors.getEntity(undefined, 'entity', 123)).toThrow();
    expect(() => selectors.getEntity({}, 'entity', 123)).toThrow();
  });

  test('returns empty object when no state exists for entity', () => {
    expect(selectors.getEntity({}, 'test')).toEqual({});
  });

  test('returns empty object when no state for entity', () => {
    expect(selectors.getEntity(altState, 'test')).toEqual({});
    expect(selectors.getEntity(altState, 'entity')).toEqual(altState.entity);
  });

  test('returns successfully', () => {
    expect(selectors.getEntity(altState, 'test')).toEqual({});
    expect(selectors.getEntity(altState, 'entity')).toEqual(altState.entity);
  });
});

describe('getEntityItem', () => {
  test('throws on bad arguments', () => {
    expect(() => selectors.getEntityItem()).toThrow();
    expect(() => selectors.getEntityItem('bad', 'entity', 123)).toThrow();
    expect(() => selectors.getEntityItem({}, 100, 123)).toThrow();
    expect(() => selectors.getEntityItem(undefined, 'entity', '123')).toThrow();
  });

  // k.check('generative test`', [getEntityItemDataFuzzer], ({ entity, id, data }) => {
  //   const mockData = genEntityItemMockData(entity, id, data);
  //   const { state, entityState, entityItem } = mockData;
  //   console.log('--->>',{
  //     state,
  //     entity,
  //     id,
  //     data,
  //     mockData,
  //   });   
  //   const result = selectors.getEntityItem(state, entity, id)
  //   expect(result).toEqual(entityItem);
  // });

  // expect(selectors.getEntityItem(altState, 'entity', 1)).toEqual(altState.entity[1]);
});

// test('getEntityItemList', () => {
//   // expect(selectors.getEntityItemList(undefined, 'test')).toEqual([]);
//   // expect(selectors.getEntityItemList(undefined, 'test', [1])).toEqual([undefined]);
//   // expect(selectors.getEntityItemList({}, 'test')).toEqual([]);
//   // expect(selectors.getEntityItemList({}, 'test', [1])).toEqual([undefined]);
//   // expect(selectors.getEntityItemList(altState, 'entity'))
//   //   .toEqual(Object.entities(altState.entity));

//   expect(selectors.getEntityItemList(altState, 'entity', [1])).toEqual([altState.entity[1]]);
// });
