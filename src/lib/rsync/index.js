export const handleAsync = async (store, payload, meta, prevResponse = []) => {
  const { effect, resolve, reject } = meta;
  let response;

  try {
    response = await effect(payload, prevResponse);
    store.dispatch({
      type: resolve.type,
      payload: {...payload, response}
    });
  } catch (error) {
    store.dispatch({
      type: reject.type,
      error: {...payload, error}
    });
  }

  return response;
}

export const handleFlow = async (store, payload, meta) => {
  const { actions, resolve, reject } = meta;
  let prevResponse = [],
      action = {},
      response;

  try {
    for (const actionCallback of actions) {
      action = actionCallback.effect(payload)

      store.dispatch({
        type: action.type,
        payload: {...payload, ignoreEffect: true}
      });

      response = await handleAsync(
        store,
        payload,
        action.meta.async,
        prevResponse
      )

      prevResponse = [...prevResponse, response];
    }

    store.dispatch({ type: resolve.type });
  } catch (error) {
    store.dispatch({ type: reject.type });
  }
}

export default store => next => action => {
  const { payload, meta } = action;

  console.log(action)

  if (meta && !payload.hasOwnProperty('ignoreEffect')) {
    if (meta.hasOwnProperty('async')) {
      handleAsync(store, payload, meta.async);
    }
  
    if (meta.hasOwnProperty('flow')) {
      handleFlow(store, payload, meta.flow);
    }
  }

  next(action);
}