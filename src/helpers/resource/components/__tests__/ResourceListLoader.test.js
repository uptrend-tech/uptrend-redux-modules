// eslint-disable-next-line
import 'dom-testing-library/extend-expect';
import React from 'react'
import {wait} from 'react-testing-library'
import {mockApi, renderWithRedux} from '../../../../utils/test'
import ResourceListLoader from '../ResourceListLoader'
import {Status} from './helpers/ResourceLoader'

test('receives props and renders initial statusView', () => {
  const {getByTestId} = renderWithRedux(
    <ResourceListLoader
      resource="example"
      renderInitial={() => <Status initial />}
    >
      {({statusView}) => statusView}
    </ResourceListLoader>,
  )
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('receives props and renders status.initial true', () => {
  const {getByTestId} = renderWithRedux(
    <ResourceListLoader resource={'example'} resourceId={1}>
      {({status}) => <div>{status.initial && <Status initial />}</div>}
    </ResourceListLoader>,
  )
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('auto loads list and renders results', async () => {
  mockApi.onGet('/user').reply(200, {id: 1, name: 'Ben'})

  // Renders ResourceListLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceListLoader
      resource="user"
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={userList => <Status success>{`${userList}`}</Status>}
      autoLoad
    >
      {({statusView}) => <div>{statusView}</div>}
    </ResourceListLoader>,
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
