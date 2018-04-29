import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import createSagaMiddleware from 'redux-saga'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import {render, Simulate, wait} from 'react-testing-library'
import {schema} from 'normalizr'
import ReduxThunk from 'redux-thunk'
import {middleware as ReduxSagaThunk} from 'redux-saga-thunk'
import ResourceLoader from '../ResourceLoader'
import 'dom-testing-library/extend-expect'
import {createResource, createEntities} from '../../../../'
import API from '../../../../utils/test/api'

// // TODO convert this to a function that returns API results we can use as arg for renderWithRedux
// const defaultApi = {
//   post: (path, data) => Promise.resolve({data}),
//   get: () => Promise.resolve({data: [1, 2, 3]}),
//   put: (path, data) => Promise.resolve({data}),
//   delete: () => Promise.resolve(),
// }
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

function stringify(...args) {
  return JSON.stringify(args, null, 2)
}

const StatusInitial = () => <div data-testid="render-initial">Initial</div>
const StatusLoading = () => <div data-testid="render-loading">Loading</div>
const StatusError = error => <div data-testid="render-error">{error}</div>
// const StatusSuccess = (result) => </div>

test('ResourceLoader component receives props and renders initial status', () => {
  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, getByText, container} = renderWithRedux(
    <ResourceLoader
      resource={'example'}
      renderInitial={() => <StatusInitial />}
    >
      {({statusView}) => statusView}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // Renders ResourceLoader component with conditional content using status.initial.
  renderWithRedux(
    <ResourceLoader resource={'example'}>
      {({status}) => <div>{status.initial && <StatusInitial />}</div>}
    </ResourceLoader>,
    {container},
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('ResourceLoader loads detail and renders results', async () => {
  mockApi.onGet('/user').reply(200, {
    data: {id: 1, name: 'Ben'}, // {id: 2, name: 'Sam'}],
  })
  const response = await api.get('user')
  expect(response.ok).toBe(true)
  expect(response.status).toBe(200)
  // expect(response.data).toEqual({x: 'hello'})

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, container} = renderWithRedux(
    <ResourceLoader
      resource={'user'}
      renderInitial={() => <StatusInitial />}
      renderError={error => <StatusError error={error} />}
      renderLoading={() => <StatusLoading />}
      renderSuccess={result => (
        <div data-testid="render-success">{stringify(result)}</div>
      )}
      loadOnMount
    >
      {({statusView}) => statusView}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  // expect(getByTestId('render-loading')).toHaveTextContent('Loading')

  /*  'wait' method waits (4500ms by default) until a callback
   *  function stops throwing an error. It is being checked
   *  at 50ms intervals.
   *
   *  Waiting until Loading message disappear from DOM
   */
  await wait(() => expect(getByTestId('render-loading')).not.toBeInTheDOM())

  // // Renders ResourceLoader component with conditional content using status.initial.
  // renderWithRedux(
  //   <ResourceLoader resource={'example'}>
  //     {({status}) => <div>{status.initial && <StatusInitial />}</div>}
  //   </ResourceLoader>,
  //   {container},
  // )

  // // Expects ResourceLoader component to render statusView from renderInitial.
  // expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})
// test("'JokeGenerator' component fetches a random joke a renders it", async () => {
//   // Mocking response for axios.get(RANDOM_JOKE_URL) request
//   mock.onGet().replyOnce(200, {
//     value: {
//       joke: 'Really funny joke!',
//     },
//   })

//   // Rendering JokeGenerator component
//   const {getByText, queryByText, queryByTestId} = render(<JokeGenerator />)

//   /* Checking if a default text is being displayed when
//    * no joke has been loaded yet.
//    */
//   expect(getByText("You haven't loaded any joke yet!")).toBeInTheDOM()

//   // Simulating a button click in the browser
//   Simulate.click(getByText('Load a random joke'))

//   // Checking if the default text is no longer displayed.
//   expect(queryByText("You haven't loaded any joke yet!")).not.toBeInTheDOM()

//   // Checking if 'Loading...' is visible in the DOM.
//   expect(queryByText('Loading...')).toBeInTheDOM()

//   /*  'wait' method waits (4500ms by default) until a callback
//    *  function stops throwing an error. It is being checked
//    *  at 50ms intervals.
//    *
//    *  Waiting until Loading message disappear from DOM
//    */
//   await wait(() => expect(queryByText('Loading...')).not.toBeInTheDOM())

//   // Checking if joke is being displayed.
//   expect(queryByTestId('joke-text')).toBeInTheDOM()
// })
