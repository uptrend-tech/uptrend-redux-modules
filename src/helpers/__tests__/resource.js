import cases from 'jest-in-case'
import {schema} from 'normalizr'
import * as actions from '../../modules/resource/actions'
import createResourceHelpers from '../resource'
import {createResource, createEntities} from '../../'

const userSchema = new schema.Entity('user', {}, {idAttribute: 'uuid'})
const teamSchema = new schema.Entity('team', {idAttribute: 'id'})

const getSchemas = () => ({team: teamSchema, user: userSchema})
const getState = () => ({
  entities: {
    team: {
      1: {id: 1, name: 'Team 1'},
      2: {id: 2, name: 'Team 2'},
      3: {id: 3, name: 'Team 3'},
    },
    user: {
      one: {uuid: 'one', name: 'orther'},
      two: {uuid: 'two', name: 'benjamin'},
      three: {uuid: 'three', name: 'dylan'},
    },
  },
  resource: {
    team: {list: [1, 2, 3], detail: 2},
    user: {list: ['one', 'two', 'three'], detail: 'three'},
  },
})

const getStatusValues = status => {
  const pending = status === 'pending'
  const rejected = status === 'rejected'
  const fulfilled = status === 'fulfilled'
  const done = rejected || fulfilled

  return {pending, rejected, fulfilled, done}
}

const getThunkState = (thunkName, status) => {
  const {pending, rejected, fulfilled, done} = getStatusValues(status)

  return {
    thunk: {
      pending: {[thunkName]: pending},
      rejected: {[thunkName]: rejected},
      fulfilled: {[thunkName]: fulfilled},
      done: {[thunkName]: done},
    },
  }
}

const createHelpers = () => {
  const entities = createEntities({isDevEnv: false, schemas: getSchemas()})
  const resource = createResource()
  return createResourceHelpers({entities, resource})
}

describe('createResourceHelpers', () => {
  const resourceHelpers = createHelpers()
  test('module parts defined', () => {
    expect(resourceHelpers.resourceCreate).toBeDefined()
    expect(resourceHelpers.resourceDelete).toBeDefined()
    expect(resourceHelpers.resourceDetailRead).toBeDefined()
    expect(resourceHelpers.resourceListCreate).toBeDefined()
    expect(resourceHelpers.resourceListRead).toBeDefined()
    expect(resourceHelpers.resourceUpdate).toBeDefined()
  })
})

describe('resourceCreate', () => {
  const {resourceCreate} = createHelpers()
  const expectActions = actions.resourceCreateRequest
  cases(
    'action',
    opts => {
      const {action} = resourceCreate(opts.resource, opts.entitiy)
      expect(action(opts.payload)).toEqual(
        expectActions(opts.resource, opts.payload, opts.entitiy),
      )
    },
    {
      'resource ONLY (no entitiy)': {
        resource: 'team',
        payload: {id: 1, title: 'Team 1'},
      },
      'resource & entitiy': {
        resource: 'team',
        entitiy: 'team',
        payload: {id: 1, title: 'Team 2'},
      },
    },
  )

  cases(
    'selectors',
    opts => {
      const state = {
        ...getState(),
        ...getThunkState(opts.resource, opts.status),
      }
      const statuses = getStatusValues(opts.status)
      const {selectors} = resourceCreate(opts.resource, opts.entitiy)
      expect(selectors.pending(state)).toEqual(statuses.pending)
      expect(selectors.rejected(state)).toEqual(statuses.rejected)
      expect(selectors.fulfilled(state)).toEqual(statuses.fulfilled)
      expect(selectors.done(state)).toEqual(statuses.done)
      expect(selectors.resource(state)).toEqual(state.resource.team.detail)
      expect(selectors.result(state)).toEqual(
        state.entities.team[state.resource.team.detail],
      )
    },
    {none: {resource: 'team', entitiy: 'team'}},
    {pending: {resource: 'team', entitiy: 'team', status: 'pending'}},
    {rejected: {resource: 'team', entitiy: 'team', status: 'rejected'}},
    {fulfilled: {resource: 'team', entitiy: 'team', status: 'fulfilled'}},
    {done: {resource: 'team', entitiy: 'team', status: 'done'}},
  )
})

describe('resourceDelete', () => {
  const {resourceDelete} = createHelpers()
  const expectActions = actions.resourceDeleteRequest
  cases(
    'action',
    opts => {
      const {action} = resourceDelete(opts.resource, opts.entitiy)
      expect(action(opts.payload)).toEqual(
        expectActions(opts.resource, opts.payload, opts.entitiy),
      )
    },
    {
      'resource ONLY (no entitiy)': {
        resource: 'team',
        payload: {needle: 1},
      },
      'resource & entitiy': {
        resource: 'team',
        entitiy: 'team',
        payload: {needle: 1},
      },
    },
  )

  cases(
    'selectors',
    opts => {
      const state = {
        ...getState(),
        ...getThunkState(opts.resource, opts.status),
      }
      const statuses = getStatusValues(opts.status)
      const {selectors} = resourceDelete(opts.resource, opts.entitiy)
      expect(selectors.pending(state)).toEqual(statuses.pending)
      expect(selectors.rejected(state)).toEqual(statuses.rejected)
      expect(selectors.fulfilled(state)).toEqual(statuses.fulfilled)
      expect(selectors.done(state)).toEqual(statuses.done)
      expect(selectors.resource(state)).toEqual(state.resource.team.list)
      expect(selectors.result(state)).toEqual([
        state.entities.team[1],
        state.entities.team[2],
        state.entities.team[3],
      ])
    },
    {none: {resource: 'team', entitiy: 'team'}},
    {pending: {resource: 'team', entitiy: 'team', status: 'pending'}},
    {rejected: {resource: 'team', entitiy: 'team', status: 'rejected'}},
    {fulfilled: {resource: 'team', entitiy: 'team', status: 'fulfilled'}},
    {done: {resource: 'team', entitiy: 'team', status: 'done'}},
  )
})

describe('resourceDetailRead', () => {
  const {resourceDetailRead} = createHelpers()
  const expectActions = actions.resourceDetailReadRequest
  cases(
    'action',
    opts => {
      const {action} = resourceDetailRead(opts.resource, opts.entitiy)
      expect(action(opts.payload)).toEqual(
        expectActions(opts.resource, opts.payload, opts.entitiy),
      )
    },
    {
      'resource ONLY (no entitiy)': {
        resource: 'team',
        payload: {id: 1, title: 'Team 1'},
      },
      'resource & entitiy': {
        resource: 'team',
        entitiy: 'team',
        payload: {id: 1, title: 'Team 2'},
      },
    },
  )

  cases(
    'selectors',
    opts => {
      const state = {
        ...getState(),
        ...getThunkState(opts.resource, opts.status),
      }
      const statuses = getStatusValues(opts.status)
      const {selectors} = resourceDetailRead(opts.resource, opts.entitiy)
      expect(selectors.pending(state)).toEqual(statuses.pending)
      expect(selectors.rejected(state)).toEqual(statuses.rejected)
      expect(selectors.fulfilled(state)).toEqual(statuses.fulfilled)
      expect(selectors.done(state)).toEqual(statuses.done)
      expect(selectors.resource(state)).toEqual(state.resource.team.detail)
      expect(selectors.result(state)).toEqual(
        state.entities.team[state.resource.team.detail],
      )
    },
    {none: {resource: 'team', entitiy: 'team'}},
    {pending: {resource: 'team', entitiy: 'team', status: 'pending'}},
    {rejected: {resource: 'team', entitiy: 'team', status: 'rejected'}},
    {fulfilled: {resource: 'team', entitiy: 'team', status: 'fulfilled'}},
    {done: {resource: 'team', entitiy: 'team', status: 'done'}},
  )
})

describe('resourceListCreate', () => {
  const {resourceListCreate} = createHelpers()
  const expectActions = actions.resourceListCreateRequest
  cases(
    'action',
    opts => {
      const {action} = resourceListCreate(opts.resource, opts.entitiy)
      expect(action(opts.payload)).toEqual(
        expectActions(opts.resource, opts.payload, opts.entitiy),
      )
    },
    {
      'resource ONLY (no entitiy)': {
        resource: 'team',
        payload: {id: 1, title: 'Team 1'},
      },
      'resource & entitiy': {
        resource: 'team',
        entitiy: 'team',
        payload: {id: 1, title: 'Team 2'},
      },
    },
  )

  cases(
    'selectors',
    opts => {
      const state = {
        ...getState(),
        ...getThunkState(opts.resource, opts.status),
      }
      const statuses = getStatusValues(opts.status)
      const {selectors} = resourceListCreate(opts.resource, opts.entitiy)
      expect(selectors.pending(state)).toEqual(statuses.pending)
      expect(selectors.rejected(state)).toEqual(statuses.rejected)
      expect(selectors.fulfilled(state)).toEqual(statuses.fulfilled)
      expect(selectors.done(state)).toEqual(statuses.done)
      expect(selectors.resource(state)).toEqual(state.resource.team.list)
      expect(selectors.result(state)).toEqual([
        state.entities.team[1],
        state.entities.team[2],
        state.entities.team[3],
      ])
    },
    {none: {resource: 'team', entitiy: 'team'}},
    {pending: {resource: 'team', entitiy: 'team', status: 'pending'}},
    {rejected: {resource: 'team', entitiy: 'team', status: 'rejected'}},
    {fulfilled: {resource: 'team', entitiy: 'team', status: 'fulfilled'}},
    {done: {resource: 'team', entitiy: 'team', status: 'done'}},
  )
})

describe('resourceListRead', () => {
  const {resourceListRead} = createHelpers()
  const expectActions = actions.resourceListReadRequest
  cases(
    'action',
    opts => {
      const {action} = resourceListRead(opts.resource, opts.entitiy)
      expect(action(opts.payload)).toEqual(
        expectActions(opts.resource, opts.payload, opts.entitiy),
      )
    },
    {
      'resource ONLY (no entitiy)': {
        resource: 'team',
        payload: {id: 1, title: 'Team 1'},
      },
      'resource & entitiy': {
        resource: 'team',
        entitiy: 'team',
        payload: {id: 1, title: 'Team 2'},
      },
    },
  )

  cases(
    'selectors',
    opts => {
      const state = {
        ...getState(),
        ...getThunkState(opts.resource, opts.status),
      }
      const statuses = getStatusValues(opts.status)
      const {selectors} = resourceListRead(opts.resource, opts.entitiy)
      expect(selectors.pending(state)).toEqual(statuses.pending)
      expect(selectors.rejected(state)).toEqual(statuses.rejected)
      expect(selectors.fulfilled(state)).toEqual(statuses.fulfilled)
      expect(selectors.done(state)).toEqual(statuses.done)
      expect(selectors.resource(state)).toEqual(state.resource.team.list)
      expect(selectors.result(state)).toEqual([
        state.entities.team[1],
        state.entities.team[2],
        state.entities.team[3],
      ])
    },
    {none: {resource: 'team', entitiy: 'team'}},
    {pending: {resource: 'team', entitiy: 'team', status: 'pending'}},
    {rejected: {resource: 'team', entitiy: 'team', status: 'rejected'}},
    {fulfilled: {resource: 'team', entitiy: 'team', status: 'fulfilled'}},
    {done: {resource: 'team', entitiy: 'team', status: 'done'}},
  )
})

describe('resourceUpdate', () => {
  const {resourceUpdate} = createHelpers()
  const expectActions = actions.resourceUpdateRequest
  cases(
    'action',
    opts => {
      const {action} = resourceUpdate(opts.resource, opts.entitiy)
      expect(action(opts.payload)).toEqual(
        expectActions(opts.resource, opts.payload, opts.entitiy),
      )
    },
    {
      'resource ONLY (no entitiy)': {
        resource: 'team',
        payload: {id: 1, title: 'Team 1'},
      },
      'resource & entitiy': {
        resource: 'team',
        entitiy: 'team',
        payload: {id: 1, title: 'Team 2'},
      },
    },
  )

  cases(
    'selectors',
    opts => {
      const state = {
        ...getState(),
        ...getThunkState(opts.resource, opts.status),
      }
      const statuses = getStatusValues(opts.status)
      const {selectors} = resourceUpdate(opts.resource, opts.entitiy)
      expect(selectors.pending(state)).toEqual(statuses.pending)
      expect(selectors.rejected(state)).toEqual(statuses.rejected)
      expect(selectors.fulfilled(state)).toEqual(statuses.fulfilled)
      expect(selectors.done(state)).toEqual(statuses.done)
      expect(selectors.resource(state)).toEqual(state.resource.team.detail)
      expect(selectors.result(state)).toEqual(
        state.entities.team[state.resource.team.detail],
      )
    },
    {none: {resource: 'team', entitiy: 'team'}},
    {pending: {resource: 'team', entitiy: 'team', status: 'pending'}},
    {rejected: {resource: 'team', entitiy: 'team', status: 'rejected'}},
    {fulfilled: {resource: 'team', entitiy: 'team', status: 'fulfilled'}},
    {done: {resource: 'team', entitiy: 'team', status: 'done'}},
  )
})
