import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { userSlice, postSlice } from '../redux-toolkit/slice'
import { loadInitialData } from '../redux-toolkit/flow'
import './Post.css'

function Post (props) {
  useEffect(() => {
    init(props)
    // requestGetPosts(props);
    // requestGetPostsWithCancel(props);
  }, [])

  useEffect(() => {
    console.log('User state:', props.user)
    console.log('Post state:', props.post)
  }, [props.user, props.post])

  return (
    <div className='Post'>
      <p>Post Component</p>
    </div>
  )
}

export function init (props) {
  props.loadInitialData({ foo: 'bar', message: 'first' })

  setTimeout(() => {
    // will run this after the first task is completed (take: every:serial)
    props.loadInitialData({ params: { foo: 'bar', message: 'second' } })
  }, 300)
}

export function requestGetUser (props) {
  props.requestGetUser({ params: { foo: 'bar', message: 'first' } })

  setTimeout(() => {
    props.requestGetUser({ params: { foo: 'bar', message: 'second' } })

    setTimeout(() => {
      props.requestGetUser({ params: { foo: 'bar', message: 'third' } })

      setTimeout(() => {
        // should only run this last one
        props.requestGetUser({ params: { foo: 'bar', message: 'fourth' } })
      }, 300)
    }, 300)
  }, 300)
}

export function requestGetUserWithCancel (props) {
  props.requestGetUser({ params: { foo: 'bar', message: 'request' } })

  setTimeout(() => {
    props.cancelRequestGetUser({ params: { foo: 'bar', message: 'cancel' } })
  }, 300)
}

export function requestGetPosts (props) {
  props.requestGetPosts({ params: { foo: 'bar', message: 'first' } })

  setTimeout(() => {
    props.requestGetPosts({ params: { foo: 'bar', message: 'second' } })

    setTimeout(() => {
      props.requestGetPosts({ params: { foo: 'bar', message: 'third' } })

      setTimeout(() => {
        // should only run this last one
        props.requestGetPosts({ params: { foo: 'bar', message: 'fourth' } })
      }, 300)
    }, 300)
  }, 300)
}

export function requestGetPostsWithCancel (props) {
  props.requestGetPosts({ params: { foo: 'bar', message: 'request' } })

  setTimeout(() => {
    props.cancelRequestGetPosts({ params: { foo: 'bar', message: 'cancel' } })
  }, 300)
}

const mapStateToProps = (state) => ({
  user: state.user,
  post: state.post
})

const mapDispatchToProps = (dispatch) => ({
  requestGetUser: (payload) => dispatch(userSlice.actions.requestGetUser(payload)),
  cancelRequestGetUser: (payload) => dispatch(userSlice.actions.cancelRequestGetUser(payload)),
  requestGetPosts: (payload) => dispatch(postSlice.actions.requestGetPosts(payload)),
  cancelRequestGetPosts: (payload) => dispatch(postSlice.actions.cancelRequestGetPosts(payload)),
  loadInitialData: (payload) => dispatch(loadInitialData(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)
