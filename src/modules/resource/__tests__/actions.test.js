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
        thunk: {name: `resourceNameCreate`},
        autoCaseKeys: true,
      }),
    }),
  )
  expect(
    actions.resourceCreateRequest(
      'resourceName',
      {title: 'test'},
      'schemaName',
      {autoCaseKeys: false},
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_CREATE_REQUEST,
      payload: {data: {title: 'test'}},
      meta: expect.objectContaining({
        resource: 'resourceName',
        entityType: 'schemaName',
        thunk: {name: `resourceNameCreate`},
        autoCaseKeys: false,
      }),
    }),
  )
})

test('resourceCreateSuccess', () => {
  const api = {response: {data: {id: 1, title: 'test'}}}
  const payload = {api, data: api.response.data}
  expect(
    actions.resourceCreateSuccess(
      'resourceName',
      'schemaName',
      payload,
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_CREATE_SUCCESS,
      payload: {
        ...payload,
        entityType: 'schemaName',
        resource: {
          path: 'resourceName',
        },
      },
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
        normalizeEntities: true,
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
        thunk: {name: `resourceNameListCreate`},
        autoCaseKeys: true,
      }),
    }),
  )
  expect(
    actions.resourceListCreateRequest(
      'resourceName',
      [{title: 'test'}, {title: 'bros'}],
      'schemaName',
      {autoCaseKeys: false},
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_CREATE_REQUEST,
      payload: {data: [{title: 'test'}, {title: 'bros'}]},
      meta: expect.objectContaining({
        resource: 'resourceName',
        entityType: 'schemaName',
        thunk: {name: `resourceNameListCreate`},
        autoCaseKeys: false,
      }),
    }),
  )
})

test('resourceListCreateSuccess', () => {
  const api = {response: {data: [{title: 'test'}, {title: 'bros'}]}}
  const payload = {api, data: api.response.data}
  expect(
    actions.resourceListCreateSuccess(
      'resourceName',
      'schemaName',
      payload,
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_CREATE_SUCCESS,
      payload: {
        ...payload,
        entityType: 'schemaName',
        resource: {
          path: 'resourceName',
        },
      },
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
        normalizeEntities: true,
      }),
    }),
  )
  expect(
    actions.resourceListCreateSuccess(
      'resourceName',
      'schemaName',
      payload,
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_CREATE_SUCCESS,
      payload: {
        ...payload,
        entityType: 'schemaName',
        resource: {
          path: 'resourceName',
        },
      },
      meta: expect.objectContaining({
        request: 'request',
        resource: 'resourceName',
        normalizeEntities: true,
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

// --
// -- Read List
// --

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
        thunk: {name: `resourceNameListRead`},
        autoCaseKeys: true,
      }),
    }),
  )
  expect(
    actions.resourceListReadRequest(
      'resourceName',
      {fields: 'test'},
      undefined,
      {autoCaseKeys: false},
    ),
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
        thunk: {name: `resourceNameListRead`},
        autoCaseKeys: false,
      }),
    }),
  )
})

test('resourceListReadSuccess', () => {
  const api = {response: {data: [1, 2, 3]}}
  const payload = {api, data: api.response.data}
  expect(
    actions.resourceListReadSuccess(
      'resourceName',
      'schemaName',
      payload,
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_LIST_READ_SUCCESS,
      payload: {
        ...payload,
        entityType: 'schemaName',
        resource: {
          path: 'resourceName',
        },
      },
      meta: expect.objectContaining({
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

// --
// -- Read Detail
// --

test('resourceDetailReadRequest', () => {
  expect(
    actions.resourceDetailReadRequest('resourceName', 1, {flag: 1}),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DETAIL_READ_REQUEST,
      payload: {
        needle: 1,
        params: {flag: 1},
      },
      meta: expect.objectContaining({
        resource: 'resourceName',
        thunk: {name: 'resourceNameDetailRead'},
        autoCaseKeys: true,
      }),
    }),
  )
  expect(
    actions.resourceDetailReadRequest('resourceName', 1, {flag: 1}, undefined, {
      autoCaseKeys: false,
    }),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DETAIL_READ_REQUEST,
      payload: {
        needle: 1,
        params: {flag: 1},
      },
      meta: expect.objectContaining({
        resource: 'resourceName',
        thunk: {name: 'resourceNameDetailRead'},
        autoCaseKeys: false,
      }),
    }),
  )
})

test('resourceDetailReadSuccess', () => {
  const api = {response: {data: {id: 1, title: 'test'}}}
  const payload = {api, data: api.response.data}
  expect(
    actions.resourceDetailReadSuccess(
      'resourceName',
      'schemaName',
      payload,
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DETAIL_READ_SUCCESS,
      payload: {
        ...payload,
        entityType: 'schemaName',
        resource: {
          path: 'resourceName',
        },
      },
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

// --
// -- Update
// --

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
        thunk: {name: 'resourceNameUpdate'},
        autoCaseKeys: true,
      }),
    }),
  )
  expect(
    actions.resourceUpdateRequest(
      'resourceName',
      1,
      {title: 'test'},
      undefined,
      {autoCaseKeys: false},
    ),
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
        thunk: {name: 'resourceNameUpdate'},
        autoCaseKeys: false,
      }),
    }),
  )
})

test('resourceUpdateSuccess', () => {
  const api = {response: {data: {id: 1, title: 'test'}}}
  const payload = {api, data: api.response.data}
  expect(
    actions.resourceUpdateSuccess(
      'resourceName',
      'schemaName',
      payload,
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_UPDATE_SUCCESS,
      payload: {
        ...payload,
        entityType: 'schemaName',
        resource: {
          path: 'resourceName',
        },
      },
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

// --
// -- Delete
// --

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
        thunk: {name: 'resourceNameDelete'},
        autoCaseKeys: true,
      }),
    }),
  )
  expect(
    actions.resourceDeleteRequest('resourceName', 1, 'schemaName', {
      autoCaseKeys: false,
    }),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DELETE_REQUEST,
      payload: {
        needle: 1,
      },
      meta: expect.objectContaining({
        entityType: 'schemaName',
        resource: 'resourceName',
        thunk: {name: 'resourceNameDelete'},
        autoCaseKeys: false,
      }),
    }),
  )
})

test('resourceDeleteSuccess', () => {
  const api = {response: {data: {id: 1, title: 'test'}}}
  const payload = {api, data: api.response.data}
  expect(
    actions.resourceDeleteSuccess(
      'resourceName',
      'schemaName',
      payload,
      'request',
      'thunk',
    ),
  ).toEqual(
    expect.objectContaining({
      type: actions.RESOURCE_DELETE_SUCCESS,
      payload: {
        ...payload,
        entityType: 'schemaName',
        resource: {
          path: 'resourceName',
        },
      },
      meta: expect.objectContaining({
        entityType: 'schemaName',
        request: 'request',
        resource: 'resourceName',
        thunk: 'thunk',
        removeEntities: true,
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
