import configureStore from 'redux-mock-store'
import {denormalize, schema} from 'normalizr'

import {getSchemas, getEntitiesState, getEntitiesStateDenormalized} from '../../utils/test/fixtures'
import middlewareFactory from '../middleware'
import selectorsFactory from '../selectors'
import {entitiesReceive} from '../actions'

const middleware = middlewareFactory({
  schemas: getSchemas(),
})

const entitiesTestState = getEntitiesState()

const mockStore = configureStore([middleware])

const getMockDataForEntity = (entity, entityId) => {
  const schemas = getSchemas()
  const state = getEntitiesState()
  const data = denormalize({ [entity]: entityId }, schemas, state)
  console.log('den',data)
  const entities = { [entity]: { [entityId]: state[entity][entityId] } };
  const meta = { entityType: entity, normalizeEntities: true};
  const payload = { payload: {data}  };
  const action = { type: 'RES', payload: {data},  meta };
  const modifyAction = {...action, payload: {...action.payload, entities: entityId}}

  return { action, modifyAction, data,payload, entities, meta }
}

it('dispatches the exactly same action', () => {
  const store = mockStore({})
  const action = {type: 'ACT001', payload: 1}
  expect(store.dispatch(action)).toEqual(action)
  expect(store.getActions()).toEqual([action])
})

it('dispatches the exactly same action if there is no schema', () => {
  const store = mockStore({})
  const action = {
    type: 'ACT002',
    payload: {id: 2, foo: 'bar'},
    meta: {entityType: 'noentity'},
  }
  expect(store.dispatch(action)).toEqual(action)
  expect(store.getActions()).toEqual([action])
})

it('dispatches entities action along with the normalized action', () => {
  const store = mockStore({})
  const mock =  getMockDataForEntity('team', 1)
  // const meta = { entity, normalizeEntities: true};
  // const action = { type: 'ACT003', payload: {data},  meta };
  expect(store.dispatch(mock.action)).toEqual(mock.modifyAction)
  expect(store.getActions()).toEqual([
    entitiesReceive(mock.entities),
    {...mock.action, payload: mock.payload},
  ])
})

// it('dispatches entities action along with array', () => {
//   const store = mockStore({})
//   const entityId = 2;
//   const { action, modifyAction, data, entities, meta } = getMockDataForEntity('team', entityId)
//   // const action = { type: 'ACT004', payload: {data},  meta };

//   expect(store.dispatch(action)).toEqual(action)
//   expect(store.getActions()).toEqual([
//     entitiesReceive(entities),
//     {...action, payload: [entityId]},
//   ])
// })
