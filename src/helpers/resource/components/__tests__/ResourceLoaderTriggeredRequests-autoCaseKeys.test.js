/* eslint-disable complexity */
// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import React from 'react'
import {Simulate, wait} from 'react-testing-library'
import ResourceLoader from '../ResourceLoader'
import {api, mockApi, renderWithRedux} from '../../../../utils/test'
import {Status} from './helpers/ResourceLoader'

const testLocker = () => {
  const vals = {}
  return {
    put: (name, value) => (vals[name] = value),
    get: name => vals[name],
  }
}

test('error loading detail and updates status object', async () => {
  mockApi.onGet('/user/1').reply(500)

  const {getByTestId} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId={1}
      list={false}
      autoCaseKeys={false}
    >
      {({result, status, onEventLoadResource: onClick}) => (
        <div>
          <button onClick={onClick} data-testid="load-resource">
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

  expect(getByTestId('render-initial')).toBeInTheDOM()

  Simulate.click(getByTestId('load-resource'))

  await wait(() => expect(getByTestId('render-loading')).toBeInTheDOM())
  await wait(() => expect(getByTestId('render-error')).toBeInTheDOM())
  expect(getByTestId('render-done')).toBeInTheDOM()
})

// eslint-disable-next-line
const UserTap = ({id, name}) => (
  <Status success>
    {id}:{name}
  </Status>
)

test('makes resource GET requests using the child render request functions', async () => {
  const user = {ID: 'a', Name: 'Ben'}
  mockApi.onGet('/user/a').reply(200, user)
  const spyApiGet = jest.spyOn(api, 'get')

  const locker = testLocker()

  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId="a"
      renderInitial={() => <Status initial />}
      renderError={error => (
        <Status error>{JSON.stringify(error, null, 2)}</Status>
      )}
      renderLoading={() => <Status loading />}
      renderSuccess={({ID, Name}) => <UserTap {...{id: ID, name: Name}} />}
      list={false}
      autoCaseKeys={false}
    >
      {({
        statusView,
        onEventLoadResource,
        loadResource,
        loadResourceRequest,
      }) => {
        // Load Resurce
        const doLoadResource = () => locker.put('loadResource', loadResource())

        const doLoadResourceRequest = () =>
          locker.put('loadResourceRequest', loadResourceRequest())

        return (
          <div>
            {/* Load Resource */}
            <button onClick={onEventLoadResource}>OnEventLoadResource</button>
            <button onClick={doLoadResource}>LoadResource</button>
            <button onClick={doLoadResourceRequest}>LoadResourceRequest</button>
            {statusView}
          </div>
        )
      }}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // `onEventLoadResource` triggers load resource request
  Simulate.click(getByText('OnEventLoadResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Ben')

  // `loadResource` triggers load resource request
  Simulate.click(getByText('LoadResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Ben')

  // -- Triggers resource requests ONLY no status changes
  Simulate.click(getByText('LoadResourceRequest'))

  expect(spyApiGet).toHaveBeenCalledTimes(3)

  // -- confirm triggers return a promise (from redux-saga-thunk)
  expect(locker.get('loadResource')).toBeInstanceOf(Promise)
  expect(locker.get('loadResourceRequest')).toBeInstanceOf(Promise)
})

test('makes resource POST requests using the child render request functions', async () => {
  const userPost = {ID: 'a', Name: 'Mat'}
  mockApi.onPost('/user', userPost).reply(200, userPost)
  const spyApiPost = jest.spyOn(api, 'post')

  // eslint-disable-next-line
  const locker = testLocker()

  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId="a"
      renderInitial={() => <Status initial />}
      renderError={error => (
        <Status error>{JSON.stringify(error, null, 2)}</Status>
      )}
      renderLoading={() => <Status loading />}
      renderSuccess={({ID, Name}) => <UserTap {...{id: ID, name: Name}} />}
      autoCaseKeys={false}
      list={false}
    >
      {({statusView, createResource, createResourceRequest}) => {
        // Create Resurce
        const doCreateResource = () =>
          locker.put('createResource', createResource(userPost))
        const doCreateResourceRequest = () =>
          locker.put('createResourceRequest', createResourceRequest(userPost))

        return (
          <div>
            {/* Create Resource */}
            <button onClick={doCreateResource}>CreateResource</button>
            <button onClick={doCreateResourceRequest}>
              CreateResourceRequest
            </button>
            {statusView}
          </div>
        )
      }}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // `createResource` triggers create resource request
  Simulate.click(getByText('CreateResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Mat')

  // Triggers resource requests ONLY no status changes
  Simulate.click(getByText('CreateResourceRequest'))
  expect(spyApiPost).toHaveBeenCalledTimes(2)

  // Confirm triggers return a promise (from redux-saga-thunk)
  expect(locker.get('createResource')).toBeInstanceOf(Promise)
  expect(locker.get('createResourceRequest')).toBeInstanceOf(Promise)
})

test('makes resource PUT requests using the child render request functions', async () => {
  const userPut = {ID: 'a', Name: 'Tom'}
  mockApi.onPut('/user/a', userPut).reply(200, userPut)
  const spyApiPut = jest.spyOn(api, 'put')
  const locker = testLocker()

  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId="a"
      renderInitial={() => <Status initial />}
      renderError={error => (
        <Status error>{JSON.stringify(error, null, 2)}</Status>
      )}
      renderLoading={() => <Status loading />}
      renderSuccess={({ID, Name}) => <UserTap {...{id: ID, name: Name}} />}
      autoCaseKeys={false}
      list={false}
    >
      {({statusView, updateResource, updateResourceRequest}) => {
        // Update Resurce
        const doUpdateResource = () =>
          locker.put('updateResource', updateResource(userPut))
        const doUpdateResourceRequest = () =>
          locker.put('updateResourceRequest', updateResourceRequest(userPut))

        return (
          <div>
            {/* Update Resource */}
            <button onClick={doUpdateResource}>UpdateResource</button>
            <button onClick={doUpdateResourceRequest}>
              UpdateResourceRequest
            </button>
            {statusView}
          </div>
        )
      }}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // `updateResource` triggers update resource request
  Simulate.click(getByText('UpdateResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Tom')

  // Triggers resource requests ONLY no status changes
  Simulate.click(getByText('UpdateResourceRequest'))

  expect(spyApiPut).toHaveBeenCalledTimes(2)

  // confirm triggers return a promise (from redux-saga-thunk)
  expect(locker.get('updateResource')).toBeInstanceOf(Promise)
  expect(locker.get('updateResourceRequest')).toBeInstanceOf(Promise)
})

test('makes resource DELETE requests using the child render request functions', async () => {
  const userDelete = {id: 'a', name: 'Tom'}
  mockApi.onDelete('/user/a', userDelete).reply(204)
  const spyApiDelete = jest.spyOn(api, 'delete')
  const locker = testLocker()

  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId="a"
      renderInitial={() => <Status initial />}
      renderError={error => (
        <Status error>{JSON.stringify(error, null, 2)}</Status>
      )}
      renderLoading={() => <Status loading />}
      renderSuccess={() => <UserTap id="a" name="Dead" />}
      autoCaseKeys={false}
      list={false}
    >
      {({statusView, deleteResource, deleteResourceRequest}) => {
        // Delete Resurce
        const doDeleteResource = () =>
          locker.put('deleteResource', deleteResource(userDelete.id))
        const doDeleteResourceRequest = () =>
          locker.put(
            'deleteResourceRequest',
            deleteResourceRequest(userDelete.id),
          )

        return (
          <div>
            {/* Delete Resource */}
            <button onClick={doDeleteResource}>DeleteResource</button>
            <button onClick={doDeleteResourceRequest}>
              DeleteResourceRequest
            </button>
            {statusView}
          </div>
        )
      }}
    </ResourceLoader>,
  )

  // Expects ResourceLoader component to render statusView from renderInitial.
  expect(getByTestId('render-initial')).toHaveTextContent('Initial')

  // `deleteResource` triggers delete resource request
  Simulate.click(getByText('DeleteResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Dead')

  // Triggers resource requests ONLY no status changes
  Simulate.click(getByText('DeleteResourceRequest'))

  expect(spyApiDelete).toHaveBeenCalledTimes(2)

  // confirm triggers return a promise (from redux-saga-thunk)
  expect(locker.get('deleteResource')).toBeInstanceOf(Promise)
  expect(locker.get('deleteResourceRequest')).toBeInstanceOf(Promise)
})

test('auto loads and then makes update resource when updateResource called', async () => {
  const userBen = {ID: 1, Name: 'Ben'}
  const userSam = {...userBen, Name: 'Sammy'}
  mockApi.onGet('/user/1').reply(200, userBen)
  mockApi.onPut('/user/1', userSam).reply(200, userSam)

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId={1}
      renderInitial={() => <Status initial />}
      renderError={error => (
        <Status error>{JSON.stringify(error, null, 2)}</Status>
      )}
      renderLoading={() => <Status loading />}
      renderSuccess={user => (
        <Status success>
          {user.ID}:{user.Name}
        </Status>
      )}
      list={false}
      autoCaseKeys={false}
      autoLoad
    >
      {({statusView, updateResource}) => (
        <div>
          <button
            onClick={() => updateResource({...userSam})}
            data-testid="update-resource"
          >
            Update Resource
          </button>
          {statusView}
        </div>
      )}
    </ResourceLoader>,
  )

  // await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  await wait(() => {
    expect(getByTestId('render-success')).toBeInTheDOM()
    expect(getByTestId('render-success')).toHaveTextContent('1:Ben')
  })

  Simulate.click(getByText('Update Resource'))
  expect(getByTestId('render-loading')).toBeInTheDOM()

  await wait(() => {
    expect(getByTestId('render-success')).toBeInTheDOM()
    expect(getByTestId('render-success')).toHaveTextContent('1:Sam')
  })
})

test('auto loads using GET params', async () => {
  const userBen = {ID: 5, Name: 'Ben'}
  const userExtra = {ID: 5, Name: 'Extra'}
  mockApi.onGet('/user/5', {params: {Extra: 1}}).replyOnce(200, userExtra)
  mockApi.onGet('/user/5', {params: {Extra: 0}}).replyOnce(200, userBen)

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId={5}
      requestParams={{Extra: 1}}
      renderInitial={() => <Status initial />}
      renderError={error => (
        <Status error>{JSON.stringify(error, null, 2)}</Status>
      )}
      renderLoading={() => <Status loading />}
      renderSuccess={user => (
        <Status success>
          {user.ID}:{user.Name}
        </Status>
      )}
      list={false}
      autoCaseKeys={false}
      autoLoad
    >
      {({statusView, loadResource}) => (
        <div>
          <button
            onClick={() => loadResource({Extra: 0})}
            data-testid="load-resource"
          >
            Load Resource
          </button>
          {statusView}
        </div>
      )}
    </ResourceLoader>,
  )

  // await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  await wait(() => {
    expect(getByTestId('render-success')).toBeInTheDOM()
    expect(getByTestId('render-success')).toHaveTextContent('5:Extra')
  })

  Simulate.click(getByText('Load Resource'))
  expect(getByTestId('render-loading')).toBeInTheDOM()

  await wait(() => {
    expect(getByTestId('render-success')).toBeInTheDOM()
    expect(getByTestId('render-success')).toHaveTextContent('5:Ben')
  })
})
