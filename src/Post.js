import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { userSlice, postSlice } from './redux/slice';
import { loadInitialData } from './redux/flow';
import './Post.css';


function Post(props) {
  useEffect(() => {
    // init(props);
    // requestGetPosts(props);
    requestGetPostsWithCancel(props);
  }, []);

  useEffect(() => {
    console.log('User state:', props.user);
    console.log('Post state:', props.post);
  }, [props.user, props.post]);


  return (
    <div className="Post">
      <p>Post Component</p>
    </div>
  );
}

export function init(props) {
  props.loadInitialData({foo: 'bar', message: 'first'});

    setTimeout(() => {
      props.loadInitialData({params: {foo: 'bar', message: 'second'}});
    }, 300);
}

export function requestGetUsers(props) {
  props.requestGetUsers({params: {foo: 'bar', message: 'first'}});

  setTimeout(() => {
    props.requestGetUsers({params: {foo: 'bar', message: 'second'}});

    setTimeout(() => {
      props.requestGetUsers({params: {foo: 'bar', message: 'third'}});

      setTimeout(() => {
        // should only run this last one
        props.requestGetUsers({params: {foo: 'bar', message: 'fourth'}});
      }, 300);
    }, 300);
  }, 300);
}

export function requestGetUsersWithCancel(props) {
  props.requestGetUsers({params: {foo: 'bar', message: 'request'}});

  setTimeout(() => {
    props.cancelRequestGetUsers({params: {foo: 'bar', message: 'cancel'}});
  }, 300);
}

export function requestGetPosts(props) {
  props.requestGetPosts({params: {foo: 'bar', message: 'first'}});

  setTimeout(() => {
    props.requestGetPosts({params: {foo: 'bar', message: 'second'}});

    setTimeout(() => {
      props.requestGetPosts({params: {foo: 'bar', message: 'third'}});

      setTimeout(() => {
        // should only run this last one
        props.requestGetPosts({params: {foo: 'bar', message: 'fourth'}});
      }, 300);
    }, 300);
  }, 300);
}

export function requestGetPostsWithCancel(props) {
  props.requestGetPosts({params: {foo: 'bar', message: 'request'}});

  setTimeout(() => {
    props.cancelRequestGetPosts({params: {foo: 'bar', message: 'cancel'}});
  }, 300);
}

const mapStateToProps = (state) => ({
  user: state.user,
  post: state.post
});

const mapDispatchToProps = (dispatch) => ({
  requestGetUsers: (payload) => dispatch(userSlice.actions.requestGetUsers(payload)),
  cancelRequestGetUsers: (payload) => dispatch(userSlice.actions.cancelRequestGetUsers(payload)),
  requestGetPosts: (payload) => dispatch(postSlice.actions.requestGetPosts(payload)),
  cancelRequestGetPosts: (payload) => dispatch(postSlice.actions.cancelRequestGetPosts(payload)),
  loadInitialData: (payload) => dispatch(loadInitialData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post)
