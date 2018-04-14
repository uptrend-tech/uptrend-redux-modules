const ReduxThunk = require('redux-thunk').default;
const { routerMiddleware } = require('react-router-redux');
const { middleware: ReduxSagaThunk } = require('redux-saga-thunk');

const { isDevEnv } = require('sow/config');
const browserHistory = require('sow/browserHistory').default;

const middlewares = [];

middlewares.push(ReduxSagaThunk);
middlewares.push(ReduxThunk);
middlewares.push(routerMiddleware(browserHistory));

if (isDevEnv) {
  if (process.env.npm_config_redux_logger === 'true') {
    const createLogger = require('./devLogger');
    const logger = createLogger();
    // NOTE: logger must be the last middleware in chain
    middlewares.push(logger);
  }
}

const req = require.context('.', true, /\.\/.+\/middleware\.js$/);

module.exports = req.keys().map(key => req(key).default).concat(middlewares);
