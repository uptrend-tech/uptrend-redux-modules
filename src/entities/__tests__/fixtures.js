import {schema} from 'normalizr'

export const getSchemas = () => ({
  entity: new schema.Entity('entity'),
})

export const getState = () => ({
  test: {
    1: {
      id: 1,
      title: 'test 1 title',
      description: 'test 1 description',
    },
    2: {
      id: 2,
      title: 'test 2 title',
      description: 'test 2 description',
    },
    'aaa-bbb': {
      id: 'aaa-bbb',
      title: 'test aaa-bbb title',
      description: 'test aaa-bbb description',
    },
  },
  trial: {
    1: {
      id: 1,
      note: 'trial 1 note',
    },
  },
})
