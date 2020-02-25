import action from './action'
import { loadInitialDataParams } from './prepare'

export function loadInitialData (payload) {
  return {
    type: 'LOAD_INITIAL_DATA',
    payload,
    meta: {
      flow: {
        actions: [
          [
            {
              effect: action.requestGetUser,
              break: ({ response }) => !response.data.args.user
            },
            {
              prepare: loadInitialDataParams.requestGetPosts,
              effect: action.requestGetPosts
            }
          ]
        ],
        resolve: { type: 'RESOLVE_LOAD_INITIAL_DATA' },
        reject: { type: 'REJECT_LOAD_INITIAL_DATA' },
        take: 'every:serial'
      }
    }
  }
}
