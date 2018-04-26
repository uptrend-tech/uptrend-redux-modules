import createResourceHelpers from '../resource'
import {createResource, createEntities} from '../../'
import {getSchemas} from '../../utils/test/fixtures'

const createHelpers = () => {
  const entities = createEntities({isDevEnv: false, schemas: getSchemas()})
  const resource = createResource()
  return createResourceHelpers({entities, resource})
}

describe('createResourceHelpers', () => {
  const resourceHelpers = createHelpers()

  test('module parts defined', () => {
    expect(resourceHelpers.resourceCreate).toBeDefined()
    expect(resourceHelpers.resourceDelete).toBeDefined()
    expect(resourceHelpers.resourceDetailRead).toBeDefined()
    expect(resourceHelpers.resourceListCreate).toBeDefined()
    expect(resourceHelpers.resourceListRead).toBeDefined()
    expect(resourceHelpers.resourceUpdate).toBeDefined()
  })
})
