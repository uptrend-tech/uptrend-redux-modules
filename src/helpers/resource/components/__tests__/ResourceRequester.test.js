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
import ResourceRequester from '../ResourceRequester'
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

test('ResourceRequester component receives props and renders initial status', () => {
  // Renders ResourceRequester component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceRequester resource={'example'}>
      {({status}) => <div>{status.initial && <Status initial />}</div>}
    </ResourceRequester>,
  )

  // Expects ResourceRequester component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('ResourceRequester POSTs when createResource called and renders results', async () => {
  const newUserData = {id: 1, name: 'Ben'}
  mockApi.onPost('/user').reply(201, {...newUserData})

  // Renders ResourceRequester component with statusView from renderInitial prop.
  const {getByTestId, getByText} = renderWithRedux(
    <ResourceRequester resource={'user'}>
      {({status, createResource: createUser, result: user}) => (
        <div>
          <div>
            <button
              onClick={e => {
                e.preventDefault()
                createUser({...newUserData})
              }}
              data-testid="create-user"
            >
              Create User
            </button>
          </div>
          {status.initial && <Status initial />}
          {status.success && (
            <Status success>
              <div key={user.id}>
                {user.id}:{user.name}
              </div>
            </Status>
          )}
        </div>
      )}
    </ResourceRequester>,
  )

  // Expects ResourceRequester component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // Simulating a button click in the browser
  Simulate.click(getByText('Create User'))

  // Expects ResourceRequester component to render statusView from renderLoading.
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
})

// test('ResourceRequester loads with params passed in', async () => {
//   mockApi
//     .onGet('/dude', {params: {best: 'dude'}})
//     .reply(200, [{id: 1, name: 'Ben'}, {id: 2, name: 'Sam'}])

//   // Renders ResourceRequester component with statusView from renderInitial prop.
//   const {getByTestId} = renderWithRedux(
//     <ResourceRequester
//       resource={'dude'}
//       renderInitial={() => <Status initial />}
//       renderError={error => <Status error>{error}</Status>}
//       renderLoading={() => <Status loading />}
//       renderSuccess={userList => (
//         <Status success>
//           {userList.map(user => (
//             <div key={user.id}>
//               {user.id}:{user.name}
//             </div>
//           ))}
//         </Status>
//       )}
//       requestParams={{best: 'dude'}}
//       loadOnMount
//       list
//     >
//       {({statusView}) => <div>{statusView}</div>}
//     </ResourceRequester>,
//   )

//   // Expects ResourceRequester component to render statusView from renderLoading.
//   expect(getByTestId('render-loading')).toHaveTextContent('Loading')

//   // expect(api.get).toHaveBeenCalled()
//   // console.log(mockApi.history.get)
//   // // Expects ResourceRequester component to render statusView from renderSuccess.
//   await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
// })
