import cases from 'jest-in-case'
import {schema} from 'normalizr'
import * as actions from '../../resource/actions'
import createResourceHelpers from '../resource'
import {createResource, createEntities} from '../../'
// import {getSchemas} from '../../utils/test/fixtures'

// --
// -- Schemas
// --

const userSchema = new schema.Entity('user', {}, {idAttribute: 'uuid'})

const teamSchema = new schema.Entity(
  'team',
  {owner: userSchema, members: [userSchema]},
  {idAttribute: 'id'},
)

const getSchemas = () => ({
  team: teamSchema,
  user: userSchema,
})

// --
// -- State
// --

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
    team: {
      list: [1, 2, 3],
      detail: 2,
    },
    user: {
      list: ['one', 'two', 'three'],
      detail: 'three',
    },
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

  cases(
    'action',
    opts => {
      const {action} = resourceCreate(opts.resourcePath, opts.entityType)
      expect(action(opts.payload)).toEqual(
        actions.resourceCreateRequest(
          opts.resourcePath,
          opts.payload,
          opts.entityType,
        ),
      )
    },
    {
      'resourcePath ONLY (no entityType)': {
        resourcePath: 'team',
        entityType: undefined,
        payload: {id: 1, title: 'Team 1'},
      },
      'resourcePath & entityType': {
        resourcePath: 'team',
        entityType: 'team',
        payload: {id: 1, title: 'Team 2'},
      },
    },
  )

  cases(
    'selectors',
    opts => {
      const state = {
        ...getState(),
        ...getThunkState(opts.resourcePath, opts.status),
      }
      const statuses = getStatusValues(opts.status)
      const {selectors} = resourceCreate(opts.resourcePath, opts.entityType)
      expect(selectors.pending(state)).toEqual(statuses.pending)
      expect(selectors.rejected(state)).toEqual(statuses.rejected)
      expect(selectors.fulfilled(state)).toEqual(statuses.fulfilled)
      expect(selectors.done(state)).toEqual(statuses.done)
      expect(selectors.resource(state)).toEqual(state.resource.team.detail)
      expect(selectors.result(state)).toEqual(
        state.entities.team[state.resource.team.detail],
      )
    },
    {
      'entity - no status': {
        resourcePath: 'team',
        entityType: 'team',
        status: undefined,
      },
    },
    {
      'entity - pending': {
        resourcePath: 'team',
        entityType: 'team',
        status: 'pending',
      },
    },
    {
      'entity - rejected': {
        resourcePath: 'team',
        entityType: 'team',
        status: 'rejected',
      },
    },
    {
      'entity - fulfilled': {
        resourcePath: 'team',
        entityType: 'team',
        status: 'fulfilled',
      },
    },
    {
      'entity - done': {
        resourcePath: 'team',
        entityType: 'team',
        status: 'done',
      },
    },
  )
})
