import {createResource, createEntities} from '../'
import {getSchemas} from '../utils/test/fixtures'

describe('createEntities', () => {
  const entities = createEntities({
    isDevEnv: false,
    schemas: getSchemas(),
  })

  test('module parts defined', () => {
    expect(entities.actions).toBeDefined()
    expect(entities.middleware).toBeDefined()
    expect(entities.reducer).toBeDefined()
    expect(entities.schemas).toBeDefined()
    expect(entities.selectors).toBeDefined()
  })
})

describe('createResource', () => {
  const resource = createResource()

  test('module parts defined', () => {
    expect(resource.actions).toBeDefined()
    expect(resource.reducer).toBeDefined()
    expect(resource.sagas).toBeDefined()
    expect(resource.selectors).toBeDefined()
  })

  test('selector state is isolated', () => {
    const {selectors} = resource
    const localState = {thing: {list: [1, 2, 3], detail: 1}}
    const state = {resource: {...localState}}

    expect(selectors.getResourceState(undefined, 'thing')).toBe(
      selectors.initialResourceState,
    )
    expect(selectors.getResourceState(state, 'thing')).toBe(localState.thing)
    expect(selectors.getDetail(state, 'thing')).toBe(localState.thing.detail)
    expect(selectors.getList(state, 'thing')).toBe(localState.thing.list)
  })
})
