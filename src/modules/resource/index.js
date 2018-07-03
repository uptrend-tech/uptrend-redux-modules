import {isolateSelectorsState} from '../../utils'
import createSagas from './sagas'
import * as actions from './actions'
import * as selectors from './selectors'
import reducer from './reducer'

export default ({
  storeName = 'resource',
  camelCaseKeyPred,
  snakeCaseKeyPred,
} = {}) => {
  const {rootSaga} = createSagas({camelCaseKeyPred, snakeCaseKeyPred})

  return {
    actions,
    reducer,
    sagas: rootSaga,
    selectors: isolateSelectorsState(storeName, selectors),
  }
}
