// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import React from 'react'
import {Simulate, wait} from 'react-testing-library'
import ResourceLoader from '../ResourceLoader'
import {mockApi, renderWithRedux} from '../../../../utils/test'
import {DetailResourceLoaderTester, Status} from './helpers/ResourceLoader'

test('component receives props and renders initial status', () => {
  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, container} = renderWithRedux(
    <ResourceLoader
      resource="example"
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
      resource="user"
      resourceId={1}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={user => <Status success>{user.name}</Status>}
      list={false}
      autoLoad
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
      resource="user"
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={userList => (
        <Status success>
          {userList.map(user => <div key={user.id}>{user.name}</div>)}
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
      resource="user"
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={userList => (
        <Status success>
          {userList.map(user => <div key={user.id}>{user.name}</div>)}
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
      resource="dude"
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={userList => (
        <Status success>
          {userList.map(user => <div key={user.id}>{user.name}</div>)}
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

  // Expects ResourceLoader component to render statusView from renderSuccess.
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
})

// eslint-disable-next-line max-statements
describe('auto loads resource when resource or resourceId prop changes', async () => {
  mockApi.onGet('/user/1').reply(200, {id: 1, name: 'Ben'})
  mockApi.onGet('/user/2').reply(200, {id: 2, name: 'Mat'})
  mockApi.onGet('/user/3').reply(200, {id: 3, name: 'Tom'})
  mockApi.onGet('/guest/2').reply(200, {id: 2, name: 'Dylan'})

  // --
  // -- 1. Initial mount and load resource
  // --
  const {getByTestId, rerender} = renderWithRedux(
    <DetailResourceLoaderTester resource="user" resourceId={1} />,
  )
  const instanceId = getByTestId('instance-id').textContent
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('user')
  expect(getByTestId('resource-id').textContent).toBe('1')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('Ben')

  // --
  // -- 2. resrouceId change triggering loading resource
  // --
  rerender(<DetailResourceLoaderTester resource="user" resourceId={2} />)
  // confirm same instance is rendered; props changed rather than new mount
  expect(getByTestId('instance-id').textContent).toBe(instanceId)
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('user')
  expect(getByTestId('resource-id').textContent).toBe('2')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('Mat')

  // --
  // -- 3. resrouce change triggering loading resource
  // --
  rerender(<DetailResourceLoaderTester resource="guest" resourceId={2} />)
  // confirm same instance is rendered; props changed rather than new mount
  expect(getByTestId('instance-id').textContent).toBe(instanceId)
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('guest')
  expect(getByTestId('resource-id').textContent).toBe('2')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('Dylan')

  // --
  // -- 4. resrouce & resourceId change triggering loading resource
  // --
  rerender(<DetailResourceLoaderTester resource="user" resourceId={3} />)
  // confirm same instance is rendered; props changed rather than new mount
  expect(getByTestId('instance-id').textContent).toBe(instanceId)
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('user')
  expect(getByTestId('resource-id').textContent).toBe('3')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('Tom')
})
