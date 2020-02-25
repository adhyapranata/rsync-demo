import api from '../api'

export function requestGetUser (payload) {
  return {
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
  }
}

export function cancelRequestGetUser (payload) {
  return {
    type: 'CANCEL_REQUEST_GET_USER',
    payload,
    meta: {
      async: {
        cancel: { type: 'REQUEST_GET_USER' },
        resolve: { type: 'RESOLVE_CANCEL_REQUEST_GET_USER' },
        take: 'latest'
      }
    }
  }
}

export function requestGetPosts (payload) {
  return {
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
  }
}

export function cancelRequestGetPosts (payload) {
  return {
    type: 'CANCEL_REQUEST_GET_POSTS',
    payload,
    meta: {
      async: {
        cancel: { type: 'REQUEST_GET_POSTS' },
        resolve: { type: 'RESOLVE_CANCEL_REQUEST_GET_POSTS' },
        take: 'latest'
      }
    }
  }
}

export default {
  requestGetUser,
  cancelRequestGetUser,
  requestGetPosts,
  cancelRequestGetPosts
}
