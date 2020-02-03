import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { postSlice } from './redux/slice';
import { loadInitialData } from './redux/flow';
import './Post.css';


function Post(props) {
  useEffect(() => {
    // props.requestGetPosts({params: {foo: 'bar'}});
    props.loadInitialData({params: {foo: 'bar'}});
  }, []);

  console.log('Post state:', props.post);
  console.log('User state:', props.user);

  return (
    <div className="Post">
      <p>Post Component</p>
    </div>  
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  post: state.post
});

const mapDispatchToProps = (dispatch) => ({
  requestGetPosts: (payload) => dispatch(postSlice.actions.requestGetPosts(payload)),
  loadInitialData: (payload) => dispatch(loadInitialData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post)
