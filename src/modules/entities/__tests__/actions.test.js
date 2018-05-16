import * as actions from '../actions'

test('entitiesReceive', () => {
  expect(actions.entitiesReceive('test')).toEqual({
    type: actions.ENTITIES_RECEIVE,
    payload: 'test',
  })
})

test('entitiesRemove', () => {
  expect(actions.entitiesRemove('test', [1])).toEqual({
    type: actions.ENTITIES_REMOVE,
    payload: {
      entityType: 'test',
      entityIds: [1],
    },
  })
})
