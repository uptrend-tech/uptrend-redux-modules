import middlewareFactory from './middleware'
import reducerFactory from './reducer'
import selectorsFactory from './selectors'
import * as actions from './actions'

const entitiesFactory = ({isDevEnv = false, schemas = {}}) => {
  const middleware = middlewareFactory({isDevEnv, schemas})
  const selectors = selectorsFactory({schemas})
  const reducer = reducerFactory({initialState: selectors.initialState})

  return {
    actions,
    middleware,
    reducer,
    schemas,
    selectors,
  }
}

export default entitiesFactory
