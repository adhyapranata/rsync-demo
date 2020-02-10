import { createAction } from '@reduxjs/toolkit';
import { userSlice, postSlice } from './slice';

export const loadInitialData = createAction('GET_FARMS', (payload) => {
  return {
    payload,
    meta: {
      flow: {
        actions: [
          { effect: userSlice.actions.requestGetUsers },
          { effect: postSlice.actions.requestGetPosts }
        ],
        resolve: { type: 'flow/resolveLoadInitialData' },
        reject: { type: 'flow/rejectLoadInitialData' },
        parallel: false
      }
    }
  }
});