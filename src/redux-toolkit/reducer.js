import { userSlice, postSlice } from './slice'

export default {
  [userSlice.name]: userSlice.reducer,
  [postSlice.name]: postSlice.reducer
}
