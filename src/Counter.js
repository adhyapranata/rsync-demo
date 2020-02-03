import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { counterSlice } from './redux/slice';
import './Counter.css';


function Counter(props) {
  useEffect(() => {
    setInterval(() => {
      props.increment();
    }, 10000);
  }, []);

  return (
    <div className="Counter">
      <p>{props.counter}</p>
    </div>
  );
}

const mapStateToProps = (state) => ({
  counter: state.counter
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(counterSlice.actions.increment()),
  decrement: () => dispatch(counterSlice.actions.decrement()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
