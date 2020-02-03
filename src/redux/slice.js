import { createSlice } from '@reduxjs/toolkit';
import api from './api';


export const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1
  }
})

export const userSlice = createSlice({
  name: 'user',
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
    requestGetUsers: {
      reducer(state, action) {
        return {...state, isFetching: true, isFetched: false};
      },
      prepare(payload) {
        return {
          payload,
          meta: {
            async: {
              effect: () => api.user.index(),
              resolve: { type: 'user/resolveRequestGetUsers' },
              reject: { type: 'user/rejectRequestGetUsers' },
              take: 'latest'
            }
          }
        }
      }
    },
    resolveRequestGetUsers: (state, action) => ({
      ...state,
      data: JSON.parse(action.payload.response.data.args.users),
      isFetching: false,
      isFetched: true
    }),
    rejectRequestGetUsers: (state, action) => ({
      ...state,
      errros: [...state.errors, action.payload.error],
      isFetching: false,
      isFetched: true
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
      reducer(state, action) {
        return {...state, isFetching: true, isFetched: false};
      },
      prepare(payload) {
        return {
          payload,
          meta: {
            async: {
              effect: () => api.post.index(),
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
      errros: [...state.errors, action.payload.error],
      isFetching: false,
      isFetched: true
    })
  }
});