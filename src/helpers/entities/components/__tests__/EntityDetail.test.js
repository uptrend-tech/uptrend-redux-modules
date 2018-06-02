// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import React from 'react'
import PropTypes from 'prop-types'
import {renderWithRedux} from '../../../../utils/test'
import {EntityDetail} from './helpers/EntityComponents'

const renderWithReduxState = (ui, configObj = {}) =>
  renderWithRedux(ui, {
    ...configObj,
    initialState: {
      entities: {
        user: {
          1: {id: 1, name: 'Ben'},
          2: {id: 2, name: 'Tom'},
        },
      },
    },
  })

const EntityDetailTester = ({entityType, entityId}) => (
  <EntityDetail entityType={entityType} entityId={entityId}>
    {entity =>
      entity === null ? (
        <div data-testid="no-entity-found" />
      ) : (
        <div data-testid="entity-detail">{entity.name}</div>
      )
    }
  </EntityDetail>
)

EntityDetailTester.propTypes = {
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  entityType: PropTypes.string.isRequired,
}

test('component returns null for non-existing entity', () => {
  // expect render of entity detail
  const {getByTestId, rerender} = renderWithReduxState(
    <EntityDetailTester entityType="user" entityId={0} />,
  )
  expect(getByTestId('no-entity-found')).toBeInTheDOM()

  // expect rerender with different prop render different detail
  rerender(<EntityDetailTester entityType="nope" entityId={1} />)
  expect(getByTestId('no-entity-found')).toBeInTheDOM()
})

test('component renders entity detail', () => {
  // expect render of entity detail
  const {getByTestId, rerender} = renderWithReduxState(
    <EntityDetailTester entityType="user" entityId={1} />,
  )
  expect(getByTestId('entity-detail')).toHaveTextContent('Ben')

  // expect rerender with different prop render different detail
  rerender(<EntityDetailTester entityType="user" entityId={2} />)
  expect(getByTestId('entity-detail')).toHaveTextContent('Tom')
})
