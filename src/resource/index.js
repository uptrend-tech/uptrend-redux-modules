import * as actions from './actions'
import * as selectors from './selectors'
import reducer from './reducer'
import sagas from './sagas'

export default () => {
  return {
    actions,
    reducer,
    sagas,
    selectors,
  }
}
