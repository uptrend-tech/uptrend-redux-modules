/* eslint-disable complexity */
// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import React from 'react'
import {Simulate, wait} from 'react-testing-library'
import ResourceLoader from '../ResourceLoader'
import {mockApi, renderWithRedux} from '../../../../utils/test'
import {DetailResourceLoaderTester, Status} from './helpers/ResourceLoader'

test('throws error if child prop not function', () => {
  expect(() => {
    renderWithRedux(
      <ResourceLoader
        resource="example"
        renderInitial={() => <Status initial />}
        list={false}
      >
        {null}
      </ResourceLoader>,
    )
  }).toThrow()
})

test('receives props and renders initial statusView', () => {
  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource="example"
      renderInitial={() => <Status initial />}
      list={false}
    >
      {({statusView}) => statusView}
    </ResourceLoader>,
  )
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('receives props and renders status.initial true', () => {
  const {getByTestId} = renderWithRedux(
    <ResourceLoader resource={'example'} list={false}>
      {({status}) => <div>{status.initial && <Status initial />}</div>}
    </ResourceLoader>,
  )
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')
})

test('auto loads detail renders error', async () => {
  mockApi.onGet('/user/1').reply(500)

  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId={1}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error.status}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={user => <Status success>{user && user.name}</Status>}
      list={false}
      autoLoad
    >
      {({statusView}) => <div>{statusView}</div>}
    </ResourceLoader>,
  )
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')

  /*  'wait' method waits (4500ms by default) until a callback
   *  function stops throwing an error. It is being checked
   *  at 50ms intervals.
   *
   *  Waiting for renderSuccess to show in DOM
   */
  await wait(() => expect(getByTestId('render-error')).toBeInTheDOM())
})

test('auto loads detail and renders results', async () => {
  mockApi.onGet('/user/1').reply(200, {id: 1, name: 'Ben'})

  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId={1}
      renderInitial={() => <Status initial />}
      renderError={error => <Status error>{error.status}</Status>}
      renderLoading={() => <Status loading />}
      renderSuccess={user => <Status success>{user.name}</Status>}
      list={false}
      autoLoad
    >
      {({statusView}) => <div>{statusView}</div>}
    </ResourceLoader>,
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

test('error loading detail and updates status object', async () => {
  mockApi.onGet('/user/1').reply(500)

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceLoader resource="user" resourceId={1} list={false}>
      {({result, status, onEventLoadResource}) => (
        <div>
          <button onClick={onEventLoadResource} data-testid="load-resource">
            Load Resource
          </button>
          <code>{JSON.stringify(result, null, 2)}</code>
          {status.initial && <div data-testid="render-initial" />}
          {status.error && <div data-testid="render-error" />}
          {status.loading && <div data-testid="render-loading" />}
          {status.success && <div data-testid="render-success" />}
          {status.done && <div data-testid="render-done" />}
        </div>
      )}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toBeInTheDOM()

  // Simulating a button click in the browser and go through status changes
  Simulate.click(getByTestId('load-resource'))
  await wait(() => expect(getByTestId('render-loading')).toBeInTheDOM())
  await wait(() => expect(getByTestId('render-error')).toBeInTheDOM())
  expect(getByTestId('render-done')).toBeInTheDOM()
})

test('loads detail successfully and updates status object', async () => {
  mockApi.onGet('/user/1').reply(200, {id: 1, name: 'Ben'})

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceLoader resource="user" resourceId={1} list={false}>
      {({status, onEventLoadResource}) => (
        <div>
          <button onClick={onEventLoadResource} data-testid="load-resource">
            Load Resource
          </button>
          {status.initial && <div data-testid="render-initial" />}
          {status.error && <div data-testid="render-error" />}
          {status.loading && <div data-testid="render-loading" />}
          {status.success && <div data-testid="render-success" />}
          {status.done && <div data-testid="render-done" />}
        </div>
      )}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toBeInTheDOM()

  // Simulating a button click in the browser and go through status changes
  Simulate.click(getByTestId('load-resource'))
  await wait(() => expect(getByTestId('render-loading')).toBeInTheDOM())
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-done')).toBeInTheDOM()
})

test('auto loads list and renders results', async () => {
  mockApi
    // .onGet('/user', {params: {}})
    .onGet()
    .reply(200, [{id: 1, name: 'Ben'}, {id: 2, name: 'Sam'}])

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource="user"
      // resourceIds={[1, 2]}
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

  // --
  // -- 5. no change should NOT trigger loading resource
  // --
  rerender(<DetailResourceLoaderTester resource="user" resourceId={3} />)
  // confirm same instance is rendered; rather than new mount
  expect(getByTestId('instance-id').textContent).toBe(instanceId)
  // expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('user')
  expect(getByTestId('resource-id').textContent).toBe('3')
  expect(getByTestId('render-success')).toBeInTheDOM()
  expect(getByTestId('render-success')).toHaveTextContent('Tom')
})

test('post resource request and renders results', async () => {
  mockApi
    // .onGet('/user', {params: {}})
    .onGet()
    .reply(200, [{id: 1, name: 'Ben'}, {id: 2, name: 'Sam'}])

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource="user"
      // resourceIds={[1, 2]}
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

describe('loads resource when resourceId is missing or empty', async () => {
  mockApi.onGet('/test').reply(200, {id: 0, name: 'Test'})
  mockApi.onGet('/test/1').reply(200, {id: 1, name: 'One'})
  mockApi.onGet('/test/1/extra').reply(200, {id: '1e', name: 'Extra'})

  // --
  // -- 1. Initial mount and load resource with no resourceId
  // --
  const {getByTestId, rerender} = renderWithRedux(
    <DetailResourceLoaderTester resource="test" />,
  )
  const instanceId = getByTestId('instance-id').textContent
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('test')
  expect(getByTestId('resource-id').textContent).toBe('')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('Test')

  // --
  // -- 2. resrouceId change to empty string triggering loading resource
  // --
  rerender(<DetailResourceLoaderTester resource="test/1/extra" resourceId="" />)
  // confirm same instance is rendered; props changed rather than new mount
  expect(getByTestId('instance-id').textContent).toBe(instanceId)
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('test/1/extra')
  expect(getByTestId('resource-id').textContent).toBe('')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('Extra')

  // --
  // -- 3. resrouceId change to number triggering loading resource
  // --
  rerender(<DetailResourceLoaderTester resource="test" resourceId={1} />)
  // confirm same instance is rendered; props changed rather than new mount
  expect(getByTestId('instance-id').textContent).toBe(instanceId)
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  expect(getByTestId('resource').textContent).toBe('test')
  expect(getByTestId('resource-id').textContent).toBe('1')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('One')
})
