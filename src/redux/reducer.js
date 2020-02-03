import { counterSlice, userSlice, postSlice } from './slice';


export default {
  [counterSlice.name]: counterSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [postSlice.name]: postSlice.reducer
};