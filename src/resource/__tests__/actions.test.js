import * as actions from '../actions'

// --
// -- Create
// --

test('resourceCreateRequest', () => {
  expect(
    actions.resourceCreateRequest(
      'resourceName',
      {title: 'test'},
      'schemaName',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_CREATE_REQUEST,
      payload: {data: {title: 'test'}},
      meta: expect.objectContaining({
        resource: 'resourceName',
        entityType: 'schemaName',
        thunk: `resourceNameCreate`,
      }),
    }),
  )
})

test('resourceCreateSuccess', () => {
  expect(
    actions.resourceCreateSuccess(
      'resourceName',
      'schemaName',
      {id: 1, title: 'test'},
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_CREATE_SUCCESS,
      payload: {data: {id: 1, title: 'test'}},
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
      }),
    }),
  )
})

test('resourceCreateFailure', () => {
  expect(
    actions.resourceCreateFailure(
      'resourceName',
      'schemaName',
      'error',
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_CREATE_FAILURE,
      error: true,
      payload: 'error',
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
      }),
    }),
  )
})

// --
// -- Create List
// --

test('resourceListCreateRequest', () => {
  expect(
    actions.resourceListCreateRequest(
      'resourceName',
      [{title: 'test'}, {title: 'bros'}],
      'schemaName',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_CREATE_REQUEST,
      payload: {data: [{title: 'test'}, {title: 'bros'}]},
      meta: expect.objectContaining({
        resource: 'resourceName',
        entityType: 'schemaName',
        thunk: `resourceNameListCreate`,
      }),
    }),
  )
})

test('resourceListCreateSuccess', () => {
  expect(
    actions.resourceListCreateSuccess(
      'resourceName',
      'schemaName',
      [{title: 'test'}, {title: 'bros'}],
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_CREATE_SUCCESS,
      payload: {data: [{title: 'test'}, {title: 'bros'}]},
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
      }),
    }),
  )
})

test('resourceListCreateFailure', () => {
  expect(
    actions.resourceListCreateFailure(
      'resourceName',
      'schemaName',
      'error',
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_CREATE_FAILURE,
      error: true,
      payload: 'error',
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
      }),
    }),
  )
})

test('resourceListReadRequest', () => {
  expect(
    actions.resourceListReadRequest('resourceName', {fields: 'test'}),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_READ_REQUEST,
      payload: {
        params: {
          fields: 'test',
        },
      },
      meta: expect.objectContaining({
        resource: 'resourceName',
      }),
    }),
  )
})

test('resourceListReadSuccess', () => {
  expect(
    actions.resourceListReadSuccess(
      'resourceName',
      'schemaName',
      [1, 2, 3],
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_READ_SUCCESS,
      payload: {data: [1, 2, 3]},
      meta: expect.objectContaining({
        entityType: 'schemaName',
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
        normalizeEntities: true,
      }),
    }),
  )
})

test('resourceListReadFailure', () => {
  expect(
    actions.resourceListReadFailure(
      'resourceName',
      'schemaName',
      'error',
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_READ_FAILURE,
      error: true,
      payload: 'error',
      meta: expect.objectContaining({
        entityType: 'schemaName',
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
      }),
    }),
  )
})

test('resourceDetailReadRequest', () => {
  expect(actions.resourceDetailReadRequest('resourceName', 1)).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DETAIL_READ_REQUEST,
      payload: {
        needle: 1,
      },
      meta: expect.objectContaining({
        resource: 'resourceName',
      }),
    }),
  )
})

test('resourceDetailReadSuccess', () => {
  expect(
    actions.resourceDetailReadSuccess(
      'resourceName',
      'schemaName',
      {id: 1, title: 'test'},
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DETAIL_READ_SUCCESS,
      payload: {data: {id: 1, title: 'test'}},
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
        entityType: 'schemaName',
        normalizeEntities: true,
      }),
    }),
  )
})

test('resourceDetailReadFailure', () => {
  expect(
    actions.resourceDetailReadFailure(
      'resourceName',
      'schemaName',
      'error',
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DETAIL_READ_FAILURE,
      error: true,
      payload: 'error',
      meta: expect.objectContaining({
        entityType: 'schemaName',
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
      }),
    }),
  )
})

test('resourceUpdateRequest', () => {
  expect(
    actions.resourceUpdateRequest('resourceName', 1, {title: 'test'}),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_UPDATE_REQUEST,
      payload: {
        needle: 1,
        data: {
          title: 'test',
        },
      },
      meta: expect.objectContaining({
        resource: 'resourceName',
      }),
    }),
  )
})

test('resourceUpdateSuccess', () => {
  expect(
    actions.resourceUpdateSuccess(
      'resourceName',
      'schemaName',
      {id: 1, title: 'test'},
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_UPDATE_SUCCESS,
      payload: {data: {id: 1, title: 'test'}},
      meta: expect.objectContaining({
        entityType: 'schemaName',
        normalizeEntities: true,
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
      }),
    }),
  )
})

test('resourceUpdateFailure', () => {
  expect(
    actions.resourceUpdateFailure(
      'resourceName',
      'schemaName',
      'error',
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_UPDATE_FAILURE,
      error: true,
      payload: 'error',
      meta: expect.objectContaining({
        entityType: 'schemaName',
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
      }),
    }),
  )
})

test('resourceDeleteRequest', () => {
  expect(
    actions.resourceDeleteRequest('resourceName', 1, 'schemaName'),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DELETE_REQUEST,
      payload: {
        needle: 1,
      },
      meta: expect.objectContaining({
        entityType: 'schemaName',
        resource: 'resourceName',
        thunk: `resourceNameDelete`,
      }),
    }),
  )
})

test('resourceDeleteSuccess', () => {
  expect(
    actions.resourceDeleteSuccess(
      'resourceName',
      'schemaName',
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DELETE_SUCCESS,
      meta: expect.objectContaining({
        entityType: 'schemaName',
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
        normalizeEntities: true,
      }),
    }),
  )
})

test('resourceDeleteFailure', () => {
  expect(
    actions.resourceDeleteFailure(
      'resourceName',
      'schemaName',
      'error',
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DELETE_FAILURE,
      error: true,
      payload: 'error',
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
      }),
    }),
  )
})
