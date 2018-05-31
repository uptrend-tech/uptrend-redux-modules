import MockAdapter from 'axios-mock-adapter'
// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import {schema} from 'normalizr'
import React from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-testing-library'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {middleware as ReduxSagaThunk} from 'redux-saga-thunk'
import ReduxThunk from 'redux-thunk'
import {createEntities, createResource} from '../../'
import API from './api'

export const {api, axiosInstance} = API.create()
export const mockApi = new MockAdapter(axiosInstance, {delayResponse: 300})

export function createStoreForTests(initialState) {
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

// Use <FindMe /> component to  to look for  to the returned utilities to allow us
// to reference it in our tests (just try to avoid using
// this to test implementation details).
export function FindMe(props) {
  return <div data-testid="find-me" {...props} />
}

export function renderWithRedux(
  ui,
  {initialState, store = createStoreForTests(initialState)} = {},
) {
  // pass redux store prop to ui component by wrapping with
  // react-redux's Provider component
  const rendered = render(<Provider store={store}>{ui}</Provider>)
  return {
    ...rendered,

    // update `rerender` function so it passes redux store prop
    // to ui component by wrapping with react-redux's Provider
    // component by wrapping it with react-redux Provider component
    rerender: rerenderUi =>
      rendered.rerender(<Provider store={store}>{rerenderUi}</Provider>),

    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,

    // adding `getFindMe` to be used for finding the <FindMe /> component
    getFindMe: () => rendered.getByTestId('find-me'),
  }
}
