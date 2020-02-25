import { combineReducers } from 'redux'

export function userReducer (state = {
  data: {},
  errors: [],
  selected: {},
  isFetching: false,
  isFetched: false,
  isQuerying: false,
  isQueried: false
}, action) {
  switch (action.type) {
    case 'REQUEST_GET_USER':
      return { ...state, isFetching: true, isFetched: false }
    case 'RESOLVE_REQUEST_GET_USER':
      return {
        ...state,
        data: JSON.parse(action.payload.response.data.args.user),
        isFetching: false,
        isFetched: true
      }
    case 'REJECT_REQUEST_GET_USER':
      return {
        ...state,
        errors: [...state.errors, action.payload.error],
        isFetching: false,
        isFetched: true
      }
    case 'RESOLVE_CANCEL_REQUEST_GET_USER':
      return {
        ...state,
        isFetching: false,
        isFetched: false
      }
    default:
      return state
  }
}

export function postReducer (state = {
  data: [],
  errors: [],
  selected: {},
  isFetching: false,
  isFetched: false,
  isQuerying: false,
  isQueried: false
}, action) {
  switch (action.type) {
    case 'REQUEST_GET_POSTS':
      return { ...state, isFetching: true, isFetched: false }
    case 'RESOLVE_REQUEST_GET_POSTS':
      return {
        ...state,
        data: JSON.parse(action.payload.response.data.args.posts),
        isFetching: false,
        isFetched: true
      }
    case 'REJECT_REQUEST_GET_POSTS':
      return {
        ...state,
        errors: [...state.errors, action.error],
        isFetching: false,
        isFetched: true
      }
    case 'RESOLVE_CANCEL_REQUEST_GET_POSTS':
      return {
        ...state,
        isFetching: false,
        isFetched: false
      }
    default:
      return state
  }
}

export default combineReducers({
  user: userReducer,
  post: postReducer
})
