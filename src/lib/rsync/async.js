let index = 0;
let state = {
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

export default async (store, type, payload, meta) => {
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