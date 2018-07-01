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
    <ResourceLoader resource="user" resourceId={1} list={false}>
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

test('makes resource requests using the child render request functions', async () => {
  const user = {id: 'a', name: 'Ben'}
  const userPut = {id: 'a', name: 'Tom'}

  mockApi.onGet('/user/a').reply(200, user)
  mockApi.onPut('/user/a', userPut).reply(200, userPut)

  const spyApiGet = jest.spyOn(api, 'get')
  const spyApiPut = jest.spyOn(api, 'put')

  // eslint-disable-next-line
  const UserTap = ({id, name}) => (
    <Status success>
      {id}:{name}
    </Status>
  )

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
      renderSuccess={({id, name}) => <UserTap {...{id, name}} />}
      list={false}
    >
      {({
        statusView,
        onEventLoadResource,
        loadResource,
        loadResourceRequest,
        updateResource,
        updateResourceRequest,
      }) => {
        const doLoadResource = () => locker.put('loadResource', loadResource())
        const doLoadResourceRequest = () =>
          locker.put('loadResourceRequest', loadResourceRequest())
        // const doLoadResourceRequest = () => loadResourceRequest()
        // const doUpdateResource = () => updateResource(userPut)
        // const doUpdateResourceRequest = () => updateResourceRequest(userPut)
        const doUpdateResource = () =>
          locker.put('updateResource', updateResource(userPut))
        const doUpdateResourceRequest = () =>
          locker.put('updateResourceRequest', updateResourceRequest(userPut))
        return (
          <div>
            <button onClick={onEventLoadResource}>OnEventLoadResource</button>
            <button onClick={doLoadResource}>LoadResource</button>
            <button onClick={doLoadResourceRequest}>LoadResourceRequest</button>
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

  // --
  // -- 1. `onEventLoadResource` triggers load resource request
  // --
  Simulate.click(getByText('OnEventLoadResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Ben')

  // --
  // -- 2. `loadResource` triggers load resource request
  // --
  Simulate.click(getByText('LoadResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Ben')

  // --
  // -- 3. `updateResource` triggers update resource request
  // --
  Simulate.click(getByText('UpdateResource'))
  expect(getByTestId('render-loading')).toHaveTextContent('Loading')
  await wait(() => expect(getByTestId('render-success')).toBeInTheDOM())
  expect(getByTestId('render-success')).toHaveTextContent('a:Tom')

  // --
  // -- 4. `loadResourceRequest` triggers load resource request ONLY no status changes
  // --
  Simulate.click(getByText('LoadResourceRequest'))

  // --
  // -- 5. `updateResourceRequest` triggers update resource request ONLY no status changes
  // --
  Simulate.click(getByText('UpdateResourceRequest'))

  expect(spyApiGet).toHaveBeenCalledTimes(3)
  expect(spyApiPut).toHaveBeenCalledTimes(2)

  // --
  // -- 6. confirm triggers return a promise (from redux-saga-thunk)
  // --
  expect(locker.get('loadResource')).toBeInstanceOf(Promise)
  expect(locker.get('loadResourceRequest')).toBeInstanceOf(Promise)
  expect(locker.get('updateResource')).toBeInstanceOf(Promise)
  expect(locker.get('updateResourceRequest')).toBeInstanceOf(Promise)
})

test('auto loads and then makes update resource when updateResource called', async () => {
  const userBen = {id: 1, name: 'Ben'}
  const userSam = {...userBen, name: 'Sammy'}
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
          {user.id}:{user.name}
        </Status>
      )}
      list={false}
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
  const userBen = {id: 5, name: 'Ben'}
  const userExtra = {id: 5, name: 'Extra'}
  mockApi.onGet('/user/5', {params: {extra: 1}}).replyOnce(200, userExtra)
  mockApi.onGet('/user/5', {params: {extra: 0}}).replyOnce(200, userBen)

  // Renders ResourceLoader component with statusView from renderInitial prop.
  const {getByTestId, getByText} = renderWithRedux(
    <ResourceLoader
      resource="user"
      resourceId={5}
      requestParams={{extra: 1}}
      renderInitial={() => <Status initial />}
      renderError={error => (
        <Status error>{JSON.stringify(error, null, 2)}</Status>
      )}
      renderLoading={() => <Status loading />}
      renderSuccess={user => (
        <Status success>
          {user.id}:{user.name}
        </Status>
      )}
      list={false}
      autoLoad
    >
      {({statusView, loadResource}) => (
        <div>
          <button
            onClick={() => loadResource({extra: 0})}
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
