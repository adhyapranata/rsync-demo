import { createSlice } from '@reduxjs/toolkit'
import api from '../api'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {},
    errors: [],
    selected: {},
    isFetching: false,
    isFetched: false,
    isQuerying: false,
    isQueried: false
  },
  reducers: {
    requestGetUser: {
      reducer (state, action) {
        return { ...state, isFetching: true, isFetched: false }
      },
      prepare (payload) {
        return {
          payload,
          meta: {
            async: {
              effect: () => api.user.show(),
              resolve: { type: 'user/resolveRequestGetUser' },
              reject: { type: 'user/rejectRequestGetUser' },
              take: 'latest'
            }
          }
        }
      }
    },
    resolveRequestGetUser: (state, action) => ({
      ...state,
      data: JSON.parse(action.payload.response.data.args.user),
      isFetching: false,
      isFetched: true
    }),
    rejectRequestGetUser: (state, action) => ({
      ...state,
      errors: [...state.errors, action.error],
      isFetching: false,
      isFetched: true
    }),
    cancelRequestGetUser: {
      reducer (state, action) {
        return state
      },
      prepare (payload) {
        return {
          payload,
          meta: {
            async: {
              cancel: { type: 'user/requestGetUser' },
              resolve: { type: 'user/resolveCancelRequestGetUser' },
              take: 'latest'
            }
          }
        }
      }
    },
    resolveCancelRequestGetUser: (state, action) => ({
      ...state,
      isFetching: false,
      isFetched: false
    })
  }
})

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    data: [],
    errors: [],
    selected: {},
    isFetching: false,
    isFetched: false,
    isQuerying: false,
    isQueried: false
  },
  reducers: {
    requestGetPosts: {
      reducer (state, action) {
        return { ...state, isFetching: true, isFetched: false }
      },
      prepare (payload) {
        return {
          payload,
          meta: {
            async: {
              effect: payload => api.post.index(),
              resolve: { type: 'post/resolveRequestGetPosts' },
              reject: { type: 'post/rejectRequestGetPosts' },
              take: 'latest'
            }
          }
        }
      }
    },
    resolveRequestGetPosts: (state, action) => ({
      ...state,
      data: JSON.parse(action.payload.response.data.args.posts),
      isFetching: false,
      isFetched: true
    }),
    rejectRequestGetPosts: (state, action) => ({
      ...state,
      errors: [...state.errors, action.error],
      isFetching: false,
      isFetched: true
    }),
    cancelRequestGetPosts: {
      reducer (state, action) {
        return state
      },
      prepare (payload) {
        return {
          payload,
          meta: {
            async: {
              cancel: { type: 'post/requestGetPosts' },
              cancelled: { type: 'post/requestGetPostsCancelled' }
            }
          }
        }
      }
    },
    requestGetPostsCancelled: (state, action) => ({
      ...state,
      isFetching: false,
      isFetched: false
    })
  }
})
