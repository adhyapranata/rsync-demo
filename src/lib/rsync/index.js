let flowQueue = [];
let blockFlow = false;
let index = 0;
let state = {
  runningTasks: [],
  cancelledTasks: []
};

export const isUndefined = val => typeof val === 'undefined';

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

export const attachParamsToPayload = (store, payload, flowAction, prevResponse) => {
  return {
    ...payload,
    params: flowAction.prepare({
      ...payload,
      prevResponse,
      state: store.getState()
    })
  }
}

export const triggerReducer = (store, asyncAction, payload) => {
  store.dispatch({
    type: asyncAction.type,
    payload: { ...payload, ignoreEffect: true }
  });
}

export const triggerEffect = async (store, asyncAction, payload) => {
  return await handleAsync(
    store,
    asyncAction.type,
    payload,
    asyncAction.meta.async
  )
}

export const handleAsync = async (store, type, payload, meta) => {
  let response;
  const { effect, resolve, reject } = meta;
  const queue = index;
  const take = meta.take || 'every:parallel';

  updateState(type);

  try {
    response = await effect(payload);

    if (isTakeLatest(take, type, queue)) return;

    store.dispatch({
      type: resolve.type,
      payload: {
        ...payload,
        type,
        response,
        state: store.getState()
      }
    });
  } catch (error) {
    store.dispatch({
      type: reject.type,
      error: {
        ...payload,
        type,
        error,
        state: store.getState()
      }
    });
  }

  return response;
}

export const handleFlow = async (store, type, payload, meta) => {
  let response;
  let prevResponse = [];
  let asyncAction = {};

  const { actions, resolve, reject } = meta;
  const take = isUndefined(meta.take) ? 'first' : meta.take;
  
  if (blockFlow) {
    flowQueue = take === 'every:serial'
      ? [...flowQueue, { type, payload, meta: { flow: meta } }]
      : flowQueue;

    return;
  };

  try {
    blockFlow = take === 'first' || take === 'every:serial';

    for (const flowAction of actions) {
      asyncAction = flowAction.effect(payload);
      payload = { ...payload, prevResponse };

      triggerReducer(store, asyncAction, payload);

      if (flowAction.prepare) {
        payload = attachParamsToPayload(store, payload, flowAction, prevResponse);
      }

      response = await triggerEffect(store, asyncAction, payload)

      if (
        flowAction.break &&
        flowAction.break({
          ...payload,
          response,
          state: store.getState()
        })
      ) {
        throw Error(
          `${type}_EXCEPTION: Action ${asyncAction.type} is broken by user condition`
        )
      }

      prevResponse = [...prevResponse, { response, type: asyncAction.type }];
    }

    store.dispatch({ type: resolve.type });
  } catch (error) {
    store.dispatch({ type: reject.type });
  } finally {
    blockFlow = false;

    if (flowQueue.length) {
      store.dispatch(flowQueue.shift());
    }
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