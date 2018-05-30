import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import createSagaMiddleware from 'redux-saga'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import {render, Simulate, wait} from 'react-testing-library'
import {schema} from 'normalizr'
import ReduxThunk from 'redux-thunk'
// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import {middleware as ReduxSagaThunk} from 'redux-saga-thunk'
import ResourceLoader from '../ResourceLoader'
import {createResource, createEntities} from '../../../../'
import API from '../../../../utils/test/api'

const {api, axiosInstance} = API.create()
const mockApi = new MockAdapter(axiosInstance, {delayResponse: 300})

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
    applyMiddleware(ReduxSagaThunk, ReduxThunk, sagaMiddleware),
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

// eslint-disable-next-line react/prop-types
const Status = ({children, initial, loading, error, success}) => {
  if (initial) return <div data-testid="render-initial">Initial</div>
  if (loading) return <div data-testid="render-loading">Loading</div>
  if (error) return <div data-testid="render-error">{children}</div>
  if (success) return <div data-testid="render-success">{children}</div>
  throw new Error('Status component not passed status prop')
}

test('component receives props and renders initial status', () => {
  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, container} = renderWithRedux(
    <ResourceLoader
      resource={'example'}
      renderInitial={() => <Status initial />}
      list={false}
    >
      {({statusView}) => statusView}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // Renders ResourceLoader component with conditional content using status.initial.
  renderWithRedux(
    <ResourceLoader resource={'example'} list={false}>
      {({status}) => <div>{status.initial && <Status initial />}</div>}
    </ResourceLoader>,
    {container},
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('auto loads detail and renders results', async () => {
  mockApi.onGet('/user/1').reply(200, {id: 1, name: 'Ben'})

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource={'user'}
      resourceId={1}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={user => (
        <Status success>
          {user.id}:{user.name}
        </Status>
      )}
      autoLoad
      list={false}
    >
      {({statusView}) => <div>{statusView}</div>}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderLoading.
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')

  /*  'wait' method waits (4500ms by default) until a callback
   *  function stops throwing an error. It is being checked
   *  at 50ms intervals.
   *
   *  Waiting for renderSuccess to show in DOM
   */
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
})

test('auto loads list and renders results', async () => {
  mockApi
    .onGet('/user')
    .reply(200, [{id: 1, name: 'Ben'}, {id: 2, name: 'Sam'}])

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource={'user'}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={userList => (
        <Status success>
          {userList.map(user => (
            <div key={user.id}>
              {user.id}:{user.name}
            </div>
          ))}
        </Status>
      )}
      autoLoad
      list
    >
      {({statusView}) => <div>{statusView}</div>}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderLoading.
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')

  // // Expects ResourceLoader component to render statusView from renderSuccess.
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
})

test('auto loads when onEventLoadResource called and renders results', async () => {
  mockApi
    .onGet('/user')
    .reply(200, [{id: 1, name: 'Ben'}, {id: 2, name: 'Sam'}])

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource={'user'}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={userList => (
        <Status success>
          {userList.map(user => (
            <div key={user.id}>
              {user.id}:{user.name}
            </div>
          ))}
        </Status>
      )}
      list
    >
      {({statusView, onEventLoadResource}) => (
        <div>
          <div>
            <button onClick={onEventLoadResource} data-testid="load-resource">
              Load Resource
            </button>
          </div>
          {statusView}
        </div>
      )}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // Simulating a button click in the browser
  Simulate.click(getByText('Load Resource'))

  // Expects ResourceLoader component to render statusView from renderLoading.
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
})

test('auto loads with params passed in', async () => {
  mockApi
    .onGet('/dude', {params: {best: 'dude'}})
    .reply(200, [{id: 1, name: 'Ben'}, {id: 2, name: 'Sam'}])

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource={'dude'}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={userList => (
        <Status success>
          {userList.map(user => (
            <div key={user.id}>
              {user.id}:{user.name}
            </div>
          ))}
        </Status>
      )}
      requestParams={{best: 'dude'}}
      autoLoad
      list
    >
      {({statusView}) => <div>{statusView}</div>}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderLoading.
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')

  // expect(api.get).toHaveBeenCalled()
  // console.log(mockApi.history.get)
  // // Expects ResourceLoader component to render statusView from renderSuccess.
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
})
