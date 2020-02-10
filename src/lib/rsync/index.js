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

export const handleAsync = async (store, type, payload, meta, prevResponse = []) => {
  let response;

  const { effect, resolve, reject } = meta,
    queue = index,
    take = meta.take || 'every';


  updateState(type);

  try {
    response = await effect(payload, prevResponse);

    if (isTakeLatest(take, type, queue)) {
      console.log('cancelled', type, queue, state, payload.params.message);
      return;
    }

    console.log('passed', type, queue, state, payload.params.message);

    store.dispatch({
      type: resolve.type,
      payload: { ...payload, response }
    });
  } catch (error) {
    store.dispatch({
      type: reject.type,
      error: { ...payload, error }
    });
  }

  return response;
}

export const handleFlow = async (store, type, payload, meta) => {
  console.log({ flowQueue: flowQueue.length, parallel: meta.parallel })
  if (flowQueue.length) return;

  let response,
    prevResponse = [],
    action = {};

  const { actions, resolve, reject } = meta,
    parallel = typeof meta.parallel === 'undefined'
      ? false
      : meta.parallel;

  try {
    if (!parallel) {
      flowQueue = [...flowQueue, type];
    }

    for (const actionCallback of actions) {
      action = actionCallback.effect(payload)

      store.dispatch({
        type: action.type,
        payload: { ...payload, ignoreEffect: true }
      });

      response = await handleAsync(
        store,
        action.type,
        payload,
        action.meta.async,
        prevResponse
      )

      prevResponse = [...prevResponse, response];
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