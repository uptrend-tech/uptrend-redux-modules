import resourceEntitiesFactory from '../'
import {getSchemas} from '../utils/test/fixtures'

const config = {
  isDevEnv: false,
  schemas: getSchemas(),
}

describe('resourceEntitiesFactory', () => {
  const {entities, resource} = resourceEntitiesFactory(config)

  test('entities', () => {
    expect(entities.actions).toBeDefined()
    expect(entities.middleware).toBeDefined()
    expect(entities.reducer).toBeDefined()
    expect(entities.schemas).toBeDefined()
    expect(entities.selectors).toBeDefined()
  })

  test('resource', () => {
    expect(resource.actions).toBeDefined()
    expect(resource.reducer).toBeDefined()
    expect(resource.sagas).toBeDefined()
    expect(resource.selectors).toBeDefined()
  })
})
