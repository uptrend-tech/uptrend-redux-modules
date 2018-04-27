import {isolateSelectorsState} from '../../utils'
import * as actions from './actions'
import * as selectors from './selectors'
import reducer from './reducer'
import sagas from './sagas'

export default ({storeName = 'resource'} = {}) => {
  return {
    actions,
    reducer,
    sagas,
    selectors: isolateSelectorsState(storeName, selectors),
  }
}
