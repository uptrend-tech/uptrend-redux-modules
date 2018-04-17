import {schema} from 'normalizr'

// --
// -- Schemas
// --

const userSchema = new schema.Entity('user', {}, {idAttribute: 'uuid'})

const teamSchema = new schema.Entity(
  'team',
  {owner: userSchema, members: [userSchema]},
  // {idAttribute: 'id'},
)

export const getSchemas = () => ({
  team: teamSchema,
  user: userSchema,
})

// --
// -- State
// --

export const getEntitiesState = () => ({
  team: {
    1: {
      id: 1,
      name: 'Team 1',
      owner: 'aaa',
      members: [],
    },
    2: {
      id: 2,
      name: 'Team 2',
      owner: 'aaa',
      members: ['bbb'],
    },
    3: {
      id: 1,
      name: 'Team 3',
      owner: 'aaa',
      members: ['bbb', 'ccc'],
    },
  },
  user: {
    aaa: {
      uuid: 'aaa',
      name: 'orther',
    },
    bbb: {
      uuid: 'bbb',
      name: 'benjamin',
    },
    ccc: {
      uuid: 'ccc',
      name: 'dylan',
    },
  },
})
