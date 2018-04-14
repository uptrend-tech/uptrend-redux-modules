import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore as defaultCreateStore, applyMiddleware } from 'redux';

import { isDevEnv } from 'sow/config';
import middlewares from './middlewares';
import reducer from './reducer';
import sagas from './sagas';

const composeEnhancers = composeWithDevTools({
  features: {
    pause: true, // start/pause recording of dispatched actions
    lock: true, // lock/unlock dispatching actions and side effects
    persist: false, // persist states on page reloading
    export: true, // export history of actions in a file
    import: false, //'custom', // import history of actions from a file
    jump: true, // jump back and forth (time travelling)
    skip: true, // skip (cancel) actions
    reorder: false, // drag and drop actions in the history list
    dispatch: true, // dispatch custom actions or action creators
    test: false, // generate tests for the selected actions
  },
});

let createStore = defaultCreateStore;
if (process.env.npm_config_reactotron === 'true') {
  const Reactotron = require('sow/dev/ReactotronConfig').default;
  createStore = Reactotron.createStore;
}

const configureStore = (initialState, services = {}) => {
  let sagaMiddleware = createSagaMiddleware();

  if (isDevEnv) {
    if (process.env.npm_config_reactotron === 'true') {
      const Reactotron = require('sow/dev/ReactotronConfig').default;
      const sagaMonitor = Reactotron.createSagaMonitor();
      sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    }
  }

  const enhancers = [applyMiddleware(...middlewares, sagaMiddleware)];

  const store = createStore(reducer, initialState, composeEnhancers(...enhancers));

  let sagaTask = sagaMiddleware.run(sagas, services);

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer').default;
      store.replaceReducer(nextReducer);
    });
    module.hot.accept('./sagas', () => {
      const nextSagas = require('./sagas').default;
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextSagas, services);
      });
    });
  }

  return store;
};

export default configureStore;
