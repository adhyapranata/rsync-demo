let flowQueue = [],
    index = 0,
    state = {
      runningTasks: [],
      cancelledTasks: []
    };

export const findTasks = type => {
  const { runningTasks, cancelledTasks } = state;

  return {
    prevRunningTask: runningTasks.find(task => task.type === type),
    prevCancelledTask: cancelledTasks.find(task => task.type === type)
  }
}

export const addTask = type => {
  state.runningTasks = [
    ...state.runningTasks,
    { index, type }
  ];

  index++;
}

export const updateTask = type => {
  state.runningTasks = state.runningTasks.map(task => {
    return task.type === type
      ? { ...task, index }
      : task;
  });

  state.cancelledTasks = [
    ...state.cancelledTasks,
    { index: index - 1, type }
  ];

  index++;
}

export const updateState = type => {
  const { prevRunningTask, prevCancelledTask } = findTasks(type);

  if (!prevRunningTask && !prevCancelledTask) {
    addTask(type);
    return;
  }

  if (prevRunningTask) {
    updateTask(type);
    return;
  }
}

export const isTakeLatest = (take, type, queue) => {
  return (
    take === 'latest' &&
    !state.runningTasks.find(task => (
      task.type === type && task.index === queue
    ))
  );
}

export const attachParamsToPayload = (payload, actionCallback, prevResponse) => {
  return {
    ...payload,
    params: actionCallback.prepare({
      ...payload,
      prevResponse
    })
  }
}

export const triggerReducer = (store, action, payload) => {
  store.dispatch({
    type: action.type,
    payload: { ...payload, ignoreEffect: true }
  });
}

export const triggerEffect = async (store, action, payload) => {
  return await handleAsync(
    store,
    action.type,
    payload,
    action.meta.async
  )
}

export const isUndefined = val => {
  return typeof val === 'undefined';
}

export const handleAsync = async (store, type, payload, meta) => {
  let response;

  const { effect, resolve, reject } = meta,
        queue = index,
        take = meta.take || 'every';


  updateState(type);

  try {
    response = await effect(payload);

    if (isTakeLatest(take, type, queue)) return;

    store.dispatch({
      type: resolve.type,
      payload: { ...payload, type, response }
    });
  } catch (error) {
    store.dispatch({
      type: reject.type,
      error: { ...payload, type, error }
    });
  }

  return response;
}

export const handleFlow = async (store, type, payload, meta) => {
  if (flowQueue.length) return;

  let response,
    prevResponse = [],
    action = {};

  const { actions, resolve, reject } = meta,
    allowParallel = isUndefined(meta.allowParallel) ? false : meta.allowParallel;

  try {
    if (!allowParallel) {
      flowQueue = [...flowQueue, type];
    }

    for (const actionCallback of actions) {
      action = actionCallback.effect(payload);
      payload = { ...payload, prevResponse };

      triggerReducer(store, action, payload);

      if (actionCallback.prepare) {
        payload = attachParamsToPayload(payload, actionCallback, prevResponse);
      }

      response = await triggerEffect(store, action, payload)

      if (actionCallback.break && actionCallback.break(response)) {
        throw Error(`${type}_EXCEPTION: Action ${action.type} is broken by user condition`)
      }

      prevResponse = [...prevResponse, { response, type: action.type }];
    }

    store.dispatch({ type: resolve.type });
  } catch (error) {
    store.dispatch({ type: reject.type });
  } finally {
    flowQueue.splice(flowQueue.indexOf(type), 1);
  }
}

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