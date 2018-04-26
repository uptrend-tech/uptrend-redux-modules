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

const getEntitiesState = () => ({
  team: {
    1: {
      id: 1,
      name: 'Team 1',
    },
    2: {
      id: 2,
      name: 'Team 2',
    },
    3: {
      id: 3,
      name: 'Team 3',
    },
  },
  user: {
    aaa: {
      uuid: 'one',
      name: 'orther',
    },
    bbb: {
      uuid: 'two',
      name: 'benjamin',
    },
    ccc: {
      uuid: 'three',
      name: 'dylan',
    },
  },
})

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
        resourcePath: 'resourcePath',
        entityType: 'schemaName',
        payload: {id: 1, title: 'test'},
      },
      'resourcePath & entityType': {
        resourcePath: 'resourcePath',
        entityType: undefined,
        payload: {id: 1, title: 'test'},
      },
    },
  )

  // const mapDispatchToProps = {
  //   search: params => search.action(params), // = resourceListCreateRequest(`user/member`, data, 'member)
  // }

  // test('selectors', () => {
  //   const mapStateToProps = state => ({
  //     memberListDone: search.selectors.done(state),
  //     memberListFailed: search.selectors.rejected(state),
  //     memberListPending: search.selectors.pending(state),
  //     memberList: search.selectors.result(state),
  //   })
  // })
})
