import {isolateSelectorsState} from '../../utils'
import * as actions from './actions'
import createMiddleware from './middleware'
import createReducer from './reducer'
import createSelectors from './selectors'

export default ({isDevEnv = false, schemas = {}, storeName = 'entities'}) => {
  const middleware = createMiddleware({isDevEnv, schemas})
  const selectors = createSelectors({schemas})
  const reducer = createReducer({initialState: selectors.initialState})

  return {
    actions,
    middleware,
    reducer,
    schemas,
    selectors: isolateSelectorsState(storeName, selectors),
  }
}
