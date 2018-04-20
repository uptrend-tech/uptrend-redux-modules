import resource from './resource'
import entitiesFactory from './entities'

const resourceEntitiesFactory = (config = {}) => {
  return {
    entities: entitiesFactory(config),
    resource,
  }
}

export default resourceEntitiesFactory
