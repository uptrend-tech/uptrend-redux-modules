/* eslint-disable complexity */
// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import React from 'react'
import {wait} from 'react-testing-library'
import ResourceLoader from '../ResourceLoader'
import {mockApi, renderWithRedux} from '../../../../utils/test'
import {InstrumentAllStatuses} from './helpers/ResourceLoader'

// eslint-disable-next-line no-unused-vars
const delayReply = ({delay, response}) => config => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response)
    }, delay)
  })
}

const NestedLoaders = () => (
  <ResourceLoader resource="user" resourceId={1} list={false} autoLoad>
    {userOne => (
      <ResourceLoader resource="user" resourceId={2} list={false} autoLoad>
        {userTwo => (
          <div>
            <InstrumentAllStatuses status={userOne.status} label="one" />
            <InstrumentAllStatuses status={userTwo.status} label="two" />

            {userOne.status.success && (
              <div>
                <div data-testid="one-id">{userOne.result.id}</div>
                <div data-testid="one-name">{userOne.result.name}</div>
              </div>
            )}

            {userTwo.status.success && (
              <div>
                <div data-testid="two-id">{userTwo.result.id}</div>
                <div data-testid="two-name">{userTwo.result.name}</div>
              </div>
            )}
          </div>
        )}
      </ResourceLoader>
    )}
  </ResourceLoader>
)

test('renders nested ResourceLoader', async () => {
  mockApi.onGet('/user/1').reply(200, {id: 1, name: 'Ben'})
  mockApi.onGet('/user/2').reply(200, {id: 2, name: 'Tom'})
  const {getByTestId} = renderWithRedux(<NestedLoaders />)

  // --
  // -- 1. Initial mount and begin loading BOTH resources
  // --
  expect(getByTestId('one-status-loading')).toBeInTheDOM()
  expect(getByTestId('two-status-loading')).toBeInTheDOM()

  // --
  // -- 2. The second request (two) should finish before the first (one)
  // --
  await wait(() => expect(getByTestId('two-status-success')).toBeInTheDOM())
  expect(getByTestId('one-status-success')).toBeInTheDOM()

  // --
  // -- 2. Both results should be properly loaded
  // --
  expect(getByTestId('one-id')).toHaveTextContent('1')
  expect(getByTestId('one-name')).toHaveTextContent('Ben')

  expect(getByTestId('two-id')).toHaveTextContent('2')
  expect(getByTestId('two-name')).toHaveTextContent('Tom')
})

test('renders nested ResourceLoader with first request returns after second', async () => {
  // make the first request rerurn after the second
  mockApi
    .onGet('/user/1')
    .reply(delayReply({delay: 300, response: [200, {id: 1, name: 'Ben'}]}))

  mockApi
    .onGet('/user/2')
    .reply(delayReply({delay: 100, response: [200, {id: 2, name: 'Tom'}]}))

  const {getByTestId} = renderWithRedux(<NestedLoaders />)

  // --
  // -- 1. Initial mount and begin loading BOTH resources
  // --
  expect(getByTestId('one-status-loading')).toBeInTheDOM()
  expect(getByTestId('two-status-loading')).toBeInTheDOM()

  // --
  // -- 2. The second request (two) should finish before the first (one)
  // --
  await wait(() => expect(getByTestId('one-status-success')).toBeInTheDOM())
  expect(getByTestId('two-status-success')).toBeInTheDOM()

  // --
  // -- 2. Both results should be properly loaded
  // --
  expect(getByTestId('one-id')).toHaveTextContent('1')
  expect(getByTestId('one-name')).toHaveTextContent('Ben')

  expect(getByTestId('two-id')).toHaveTextContent('2')
  expect(getByTestId('two-name')).toHaveTextContent('Tom')
})
