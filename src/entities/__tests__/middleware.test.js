import configureStore from 'redux-mock-store'
import {denormalize} from 'normalizr'

import {
  getSchemas,
  getEntitiesState,
  // getEntitiesStateDenormalized,
} from '../../utils/test/fixtures'
import middlewareFactory from '../middleware'
// import selectorsFactory from '../selectors'
import {entitiesReceive} from '../actions'

const middleware = middlewareFactory({
  schemas: getSchemas(),
})

// const entitiesTestState = getEntitiesState()

const mockStore = configureStore([middleware])

const getMockDataForEntity = (entity, entityId) => {
  const schemas = getSchemas()
  const state = getEntitiesState()
  const data = denormalize({[entity]: entityId}, schemas, state)
  const entities = {[entity]: {[entityId]: state[entity][entityId]}}
  const meta = {entityType: entity, normalizeEntities: true}
  const payload = {payload: {data}}
  const action = {type: 'RES', payload: {data}, meta}
  const modifyAction = {
    ...action,
    payload: {...action.payload, entities: entityId},
  }

  return {action, modifyAction, data, payload, entities, meta}
}

const userTom = {uuid: 'aaa', name: 'Tom'}
const userSam = {uuid: 'bbb', name: 'Sam'}

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
  const mock = getMockDataForEntity('team', 1)
  // const meta = { entity, normalizeEntities: true};
  // const action = { type: 'ACT003', payload: {data},  meta };
  // console.warn(JSON.stringify(mock.action, false, 2))
  const respData = {
    id: 1,
    name: 'Team 1',
    owner: {...userTom},
    members: [{...userTom}],
  }

  // const entitiesData = {
  //   team: {
  //     id: 1,
  //     name: 'Team 1',
  //     owner: {...userTom},
  //     members: [{...userTom}],
  //   },
  // }

  const action = {
    type: 'RESP',
    payload: {data: {...respData}},
    meta: {entityType: 'team', normalizeEntities: true},
  }

  const modifiedAction = {
    type: 'RESP',
    payload: {data: {...respData}, entities: 1},
    meta: {entityType: 'team', normalizeEntities: true},
  }

  expect(store.dispatch(action)).toEqual(modifiedAction)
  // expect(store.getActions()).toEqual([
  //   entitiesReceive(mock.entities),
  //   {...mock.action, payload: mock.payload},
  // ])
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
