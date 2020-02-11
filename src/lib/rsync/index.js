import handleAsync from './async';
import handleFlow from './flow';

export default store => next => action => {
  const { payload, meta } = action;

  if (meta && !payload.hasOwnProperty('ignoreEffect')) {
    if (meta.hasOwnProperty('async')) {
      handleAsync(store, action.type, payload, meta.async);
    }

    if (meta.hasOwnProperty('flow')) {
      handleFlow(store, action.type, payload, meta.flow);
    }
  }

  next(action);
}