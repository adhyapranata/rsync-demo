import { createAction } from '@reduxjs/toolkit'
import { userSlice, postSlice } from './slice'
import { loadInitialDataParams } from './prepare'

export const loadInitialData = createAction('LOAD_INITIAL_DATA', (payload) => {
  return {
    payload,
    meta: {
      flow: {
        actions: [
          [
            {
              effect: userSlice.actions.requestGetUser,
              break: ({ response }) => !response.data.args.user
            },
            {
              prepare: loadInitialDataParams.requestGetPosts,
              effect: postSlice.actions.requestGetPosts
            }
          ]
        ],
        resolve: { type: 'flow/resolveLoadInitialData' },
        reject: { type: 'flow/rejectLoadInitialData' },
        take: 'every:serial'
      }
    }
  }
})
