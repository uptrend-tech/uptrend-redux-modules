import React from 'react'
import createSagaMiddleware from 'redux-saga'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import {render, Simulate, wait} from 'react-testing-library'
import {schema} from 'normalizr'
import ResourceLoader from '../ResourceLoader'
import 'dom-testing-library/extend-expect'
import {createResource, createEntities} from '../../../../'

const api = {
  post: (path, data) => Promise.resolve({data}),
  get: () => Promise.resolve({data: [1, 2, 3]}),
  put: (path, data) => Promise.resolve({data}),
  delete: () => Promise.resolve(),
}

function createStoreForTests(initialState) {
  const resource = createResource()
  const entities = createEntities({
    isDevEnv: false,
    schemas: {
      user: new schema.Entity('user', {}, {idAttribute: 'uuid'}),
      team: new schema.Entity('team', {idAttribute: 'id'}),
    },
  })
  const reducer = combineReducers({
    entities: entities.reducer,
    resource: resource.reducer,
  })
  const sagas = resource.sagas
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(sagaMiddleware),
  )
  sagaMiddleware.run(sagas, {api})
  return store
}

function renderWithRedux(
  ui,
  {initialState, store = createStoreForTests(initialState)} = {},
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}

const Initial = () => <div data-testid="render-initial">Not Loaded</div>

test('ResourceLoader component receives props and renders initial status', () => {
  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, getByText, container} = renderWithRedux(
    <ResourceLoader resource={'example'} renderInitial={() => <Initial />}>
      {({statusView}) => statusView}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Not Loaded')

  // Renders ResourceLoader component with conditional content using status.initial.
  renderWithRedux(
    <ResourceLoader resource={'example'} renderInitial={() => <Initial />}>
      {({status}) => <div>{status.initial && <Initial />}</div>}
    </ResourceLoader>,
    {container},
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Not Loaded')
})
