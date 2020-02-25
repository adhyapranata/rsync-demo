import { createActions } from 'reduxsauce'
import api from '../api'

export const { Types, Creators } = createActions({
  requestGetUser: payload => ({
    type: 'REQUEST_GET_USER',
    payload,
    meta: {
      async: {
        effect: () => api.user.show(),
        resolve: { type: 'RESOLVE_REQUEST_GET_USER' },
        reject: { type: 'REJECT_REQUEST_GET_USER' },
        take: 'latest'
      }
    }
  }),
  resolveRequestGetUser: payload => ({
    type: 'RESOLVE_REQUEST_GET_USER',
    payload
  }),
  rejectRequestGetUser: payload => ({
    type: 'REJECT_REQUEST_GET_USER',
    payload
  }),
  cancelRequestGetUser: payload => ({
    type: 'CANCEL_REQUEST_GET_USER',
    payload,
    meta: {
      async: {
        cancel: { type: 'REQUEST_GET_USER' },
        resolve: { type: 'RESOLVE_CANCEL_REQUEST_GET_USER' },
        take: 'latest'
      }
    }
  }),
  resolveCancelRequestGetUser: payload => ({
    type: 'RESOLVE_CANCEL_REQUEST_GET_USER',
    payload
  }),
  requestGetPosts: payload => ({
    type: 'REQUEST_GET_POSTS',
    payload,
    meta: {
      async: {
        effect: () => api.post.index(),
        resolve: { type: 'RESOLVE_REQUEST_GET_POSTS' },
        reject: { type: 'REJECT_REQUEST_GET_POSTS' },
        take: 'latest'
      }
    }
  }),
  resolveRequestGetPosts: payload => ({
    type: 'RESOLVE_REQUEST_GET_POSTS',
    payload
  }),
  rejectRequestGetPosts: payload => ({
    type: 'REJECT_REQUEST_GET_POSTS',
    payload
  }),
  cancelRequestGetPosts: payload => ({
    type: 'CANCEL_REQUEST_GET_POSTS',
    payload,
    meta: {
      async: {
        cancel: { type: 'REQUEST_GET_POSTS' },
        resolve: { type: 'RESOLVE_CANCEL_REQUEST_GET_POSTS' },
        take: 'latest'
      }
    }
  }),
  resolveCancelRequestGetPosts: payload => ({
    type: 'RESOLVE_CANCEL_REQUEST_GET_POSTS',
    payload
  })
})

export default Creators
