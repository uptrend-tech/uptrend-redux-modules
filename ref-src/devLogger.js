// TODO (orther) remove this once we get rid of seamless-immutable
import Immutable from 'seamless-immutable';
import createReduxLogger from 'redux-logger';

function actionTransformerImmutableData(action) {
  if (action.data && Immutable.isImmutable(action.data)) {
    return {
      ...action,
      data: Immutable.asMutable(action.data, { deep: true }),
    };
  }

  return action;
}

// TODO (orther) remove as soon as we can get rid of immutable data
function stateTransformerImmutableData(state) {
  // we first convert to immutable so asMutable deep can be called
  return Immutable.asMutable(Immutable.from(state), { deep: true });
}

function collapsedWhenNoErrors(getState, action, logEntry) {
  return !logEntry.error;
}

function predicate(getState, action) {
  switch (action.type) {
    // hide redux-fractal common creation component actions from console log
    case '@@ui/CREATE_COMPONENT_STATE':
    case '@@ui/DESTROY_COMPONENT_STATE':
      return false;
    default:
      return true;
  }
}

module.exports = function createLogger() {
  return createReduxLogger({
    actionTransformer: actionTransformerImmutableData,
    stateTransformer: stateTransformerImmutableData,
    collapsed: true, // collapsedWhenNoErrors,
    diff: true,
    duration: true,
    predicate: predicate,
  });
};
