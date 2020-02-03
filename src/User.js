import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { userSlice } from './redux/slice';
import './User.css';


function User(props) {
  useEffect(() => {
    props.requestGetUsers({params: {foo: 'bar'}});
  }, []);

  console.log('User state:', props.user);

  return (
    <div className="User">
      <p>User Component</p>
    </div>  
  );
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  requestGetUsers: (payload) => dispatch(userSlice.actions.requestGetUsers(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(User)
