// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import React from 'react'
import {wait} from 'react-testing-library'
import {mockApi, renderWithRedux} from '../../../../utils/test'
import ResourceDetailLoader from '../ResourceDetailLoader'
import {Status} from './helpers/ResourceLoader'

test('receives props and renders initial statusView', () => {
  const {getByTestId} = renderWithRedux(
    <ResourceDetailLoader
      resource="example"
      renderInitial={() => <Status initial />}
    >
      {({statusView}) => statusView}
    </ResourceDetailLoader>,
  )
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('receives props and renders status.initial true', () => {
  const {getByTestId} = renderWithRedux(
    <ResourceDetailLoader resource="example" resourceId={1}>
      {({status}) => <div>{status.initial && <Status initial />}</div>}
    </ResourceDetailLoader>,
  )
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('auto loads detail and renders results', async () => {
  mockApi.onGet('/user/1').reply(200, {id: 1, name: 'Ben'})

  // Renders ResourceDetailLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceDetailLoader
      resource="user"
      resourceId={1}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={user => <Status success>{user.name}</Status>}
      autoLoad
    >
      {({statusView}) => <div>{statusView}</div>}
    </ResourceDetailLoader>,
  )
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')

  /*  'wait' method waits (4500ms by default) until a callback
   *  function stops throwing an error. It is being checked
   *  at 50ms intervals.
   *
   *  Waiting for renderSuccess to show in DOM
   */
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
})
