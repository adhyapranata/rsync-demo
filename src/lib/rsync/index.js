import async from './async';
import flow from './flow';

export default store => next => action => {
  const { payload, meta } = action;

  if (meta && !payload.hasOwnProperty('ignoreEffect')) {
    if (meta.hasOwnProperty('async')) {
      async.handle(store, action.type, payload, meta.async);
    }

    if (meta.hasOwnProperty('flow')) {
      flow.handle(store, action.type, payload, meta.flow);
    }
  }

  next(action);
}