// eslint-disable-next-line
import 'dom-testing-library/extend-expect'
import createHelpers from '../'
import {createEntitiesForTests} from '../../../utils/test'

const entities = createEntitiesForTests()

test('creates and returns entities helpers', () => {
  const helpers = createHelpers(entities)

  // expect entities helper components
  expect(helpers.EntityDetail).toBeInstanceOf(Function)
  expect(helpers.EntityList).toBeInstanceOf(Function)
})
