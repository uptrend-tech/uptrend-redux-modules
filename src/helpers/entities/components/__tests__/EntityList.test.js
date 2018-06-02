// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import React from 'react'
import PropTypes from 'prop-types'
import {renderWithRedux} from '../../../../utils/test'
import {EntityList} from './helpers/EntityComponents'

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

const EntityListTester = ({entityType, entityIds}) => (
  <EntityList entityType={entityType} entityIds={entityIds}>
    {entityList =>
      entityList.length < 1 ? (
        <div data-testid="empty-entity-list" />
      ) : (
        <div data-testid="entity-list">
          {entityList.map(entity => (
            <div
              key={entity.id}
              data-testid={`entity-list-item-id-${entity.id}`}
            >
              {entity.name}
            </div>
          ))}
        </div>
      )
    }
  </EntityList>
)

EntityListTester.propTypes = {
  entityIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  entityType: PropTypes.string.isRequired,
}

test('component returns empty array for non-existing entities', () => {
  // expect render of empty entity list
  const {getByTestId, rerender} = renderWithReduxState(
    <EntityListTester entityType="user" entityIds={[]} />,
  )
  expect(getByTestId('empty-entity-list')).toBeInTheDOM()

  // expect rerender empty entity list with non-existing entity ids
  rerender(<EntityListTester entityType="nope" entityIds={[99, 98, 97]} />)
  expect(getByTestId('empty-entity-list')).toBeInTheDOM()
})

test('component renders entity list', () => {
  // expect render of entity list one item
  const {getByTestId, rerender} = renderWithReduxState(
    <EntityListTester entityType="user" entityIds={[1]} />,
  )
  expect(getByTestId('entity-list-item-id-1')).toHaveTextContent('Ben')

  // expect rerender with multiple entity list items
  rerender(<EntityListTester entityType="user" entityIds={[1, 2]} />)
  expect(getByTestId('entity-list-item-id-1')).toHaveTextContent('Ben')
  expect(getByTestId('entity-list-item-id-2')).toHaveTextContent('Tom')
})
