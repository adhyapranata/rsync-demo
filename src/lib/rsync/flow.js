import handleAsync from './async';

let flowQueue = [];
let blockFlow = false;

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

export const responseIsNotValid = (response, store, flowAction, payload) => (
  flowAction.break &&
  flowAction.break({
    ...payload,
    response,
    state: store.getState()
  })
);

export const addToQueue = (type, payload, meta) => (
  [...flowQueue, { type, payload, meta: { flow: meta } }]
);

export default async (store, type, payload, meta) => {
  let response;
  let prevResponse = [];
  let asyncAction = {};
  const { actions, resolve, reject } = meta;
  const take = meta.take === undefined
    ? 'first'
    : meta.take;
  
  if (blockFlow) {
    flowQueue = take === 'every:serial'
      ? addToQueue(type, payload, meta)
      : flowQueue;

    return;
  };

  try {
    blockFlow = take === 'first' || take === 'every:serial';

    for (const flowAction of actions) {
      asyncAction = flowAction.effect(payload);
      payload = { ...payload, prevResponse };

      triggerReducer(store, asyncAction, payload);

      payload = flowAction.prepare
        ? attachParamsToPayload(store, payload, flowAction, prevResponse)
        : payload;

      response = await triggerEffect(store, asyncAction, payload)

      if (responseIsNotValid(response, store, flowAction, payload)) {
        throw Error(
          `${type}_EXCEPTION: Action ${asyncAction.type} is broken by user condition`
        )
      }

      prevResponse = [
        ...prevResponse,
        { response, type: asyncAction.type }
      ];
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