import { combineReducers } from 'redux'
import { createReducer } from 'reduxsauce'
import { user, post } from './state'
import { Types } from './action'

export const userReducer = createReducer(user, {
  [Types.REQUEST_GET_USER]: requestGetUser,
  [Types.RESOLVE_REQUEST_GET_USER]: resolveRequestGetUser,
  [Types.REJECT_REQUEST_GET_USER]: rejectRequestGetUser,
  [Types.CANCEL_REQUEST_GET_USER]: cancelRequestGetUser,
  [Types.RESOLVE_CANCEL_REQUEST_GET_USER]: resolveCancelRequestGetUser
})

export function requestGetUser (state, action) {
  return { ...state, isFetching: true, isFetched: false }
}

export function resolveRequestGetUser (state, action) {
  return {
    ...state,
    data: JSON.parse(action.payload.response.data.args.user),
    isFetching: false,
    isFetched: true
  }
}

export function rejectRequestGetUser (state, action) {
  return {
    ...state,
    errors: [...state.errors, action.error],
    isFetching: false,
    isFetched: true
  }
}

export function cancelRequestGetUser (state, action) {
  return state
}

export function resolveCancelRequestGetUser (state, action) {
  return {
    ...state,
    isFetching: false,
    isFetched: false
  }
}

export const postReducer = createReducer(post, {
  [Types.REQUEST_GET_POSTS]: requestGetPosts,
  [Types.RESOLVE_REQUEST_GET_POSTS]: resolveRequestGetPosts,
  [Types.REJECT_REQUEST_GET_POSTS]: rejectRequestGetPosts,
  [Types.CANCEL_REQUEST_GET_POSTS]: cancelRequestGetPosts,
  [Types.RESOLVE_CANCEL_REQUEST_GET_POSTS]: resolveCancelRequestGetPosts
})

export function requestGetPosts (state, action) {
  return { ...state, isFetching: true, isFetched: false }
}

export function resolveRequestGetPosts (state, action) {
  return {
    ...state,
    data: JSON.parse(action.payload.response.data.args.posts),
    isFetching: false,
    isFetched: true
  }
}

export function rejectRequestGetPosts (state, action) {
  return {
    ...state,
    errors: [...state.errors, action.error],
    isFetching: false,
    isFetched: true
  }
}

export function cancelRequestGetPosts (state, action) {
  return state
}

export function resolveCancelRequestGetPosts (state, action) {
  return {
    ...state,
    isFetching: false,
    isFetched: false
  }
}

export default combineReducers({
  user: userReducer,
  post: postReducer
})
