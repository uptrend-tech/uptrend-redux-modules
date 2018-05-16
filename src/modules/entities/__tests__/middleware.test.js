import configureStore from 'redux-mock-store'
import {getSchemas} from '../../../utils/test/fixtures'
import {entitiesReceive} from '../actions'
import middlewareFactory from '../middleware'

const userTom = {uuid: 'aaa', name: 'Tom'}
const userSam = {uuid: 'bbb', name: 'Sam'}
const userMat = {uuid: 'ccc', name: 'Mat'}

const teamOne = {
  id: 1,
  name: 'Team 1',
  owner: {...userTom},
  members: [{...userSam}],
}

const teamTwo = {
  id: 2,
  name: 'Team 2',
  owner: {...userMat},
  members: [{...userTom}, {...userSam}],
}

describe('middlewareFactory', () => {
  const middleware = middlewareFactory({schemas: getSchemas()})
  const mockStore = configureStore([middleware])

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
    const respData = {
      id: 1,
      name: 'Team 1',
      owner: {...userTom},
      members: [{...userSam}],
    }
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

    const entities = {
      team: {1: {...respData, owner: 'aaa', members: ['bbb']}},
      user: {aaa: {...userTom}, bbb: {...userSam}},
    }

    expect(store.dispatch(action)).toEqual(modifiedAction)
    expect(store.getActions()).toEqual([
      entitiesReceive(entities),
      {...action, payload: {...action.payload, entities: 1}},
    ])
  })

  it('dispatches entities action along with array', () => {
    const store = mockStore({})
    const action = {
      type: 'RESP',
      payload: {data: [{...teamOne}, {...teamTwo}]},
      meta: {entityType: 'team', normalizeEntities: true},
    }
    const modifiedAction = {
      type: 'RESP',
      payload: {data: [{...teamOne}, {...teamTwo}], entities: [1, 2]},
      meta: {entityType: 'team', normalizeEntities: true},
    }

    const entities = {
      team: {
        1: {...teamOne, owner: 'aaa', members: ['bbb']},
        2: {...teamTwo, owner: 'ccc', members: ['aaa', 'bbb']},
      },
      user: {
        [userTom.uuid]: {...userTom},
        [userSam.uuid]: {...userSam},
        [userMat.uuid]: {...userMat},
      },
    }

    expect(store.dispatch(action)).toEqual(modifiedAction)
    expect(store.getActions()).toEqual([
      entitiesReceive(entities),
      {...action, payload: {...action.payload, entities: [1, 2]}},
    ])
  })
})

describe('middlewareFactory:isDevEnv=true', () => {
  jest.spyOn(global.console, 'warn')
  const middleware = middlewareFactory({isDevEnv: true, schemas: getSchemas()})
  const mockStore = configureStore([middleware])

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
    const respData = {
      id: 1,
      name: 'Team 1',
      owner: {...userTom},
      members: [{...userSam}],
    }
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

    const entities = {
      team: {1: {...respData, owner: 'aaa', members: ['bbb']}},
      user: {aaa: {...userTom}, bbb: {...userSam}},
    }

    expect(store.dispatch(action)).toEqual(modifiedAction)
    expect(store.getActions()).toEqual([
      entitiesReceive(entities),
      {...action, payload: {...action.payload, entities: 1}},
    ])
  })

  it('dispatches entities action along with array', () => {
    const store = mockStore({})
    const action = {
      type: 'RESP',
      payload: {data: [{...teamOne}, {...teamTwo}]},
      meta: {entityType: 'team', normalizeEntities: true},
    }
    const modifiedAction = {
      type: 'RESP',
      payload: {data: [{...teamOne}, {...teamTwo}], entities: [1, 2]},
      meta: {entityType: 'team', normalizeEntities: true},
    }

    const entities = {
      team: {
        1: {...teamOne, owner: 'aaa', members: ['bbb']},
        2: {...teamTwo, owner: 'ccc', members: ['aaa', 'bbb']},
      },
      user: {
        [userTom.uuid]: {...userTom},
        [userSam.uuid]: {...userSam},
        [userMat.uuid]: {...userMat},
      },
    }

    expect(store.dispatch(action)).toEqual(modifiedAction)
    expect(store.getActions()).toEqual([
      entitiesReceive(entities),
      {...action, payload: {...action.payload, entities: [1, 2]}},
    ])
  })

  it('skips normalizing if no data in payload', () => {
    const store = mockStore({})
    const action = {
      type: 'RESP',
      payload: {},
      meta: {entityType: 'team', normalizeEntities: true},
    }
    expect(store.dispatch(action)).toEqual(action)
    expect(store.getActions()).toEqual([action])
  })
})
