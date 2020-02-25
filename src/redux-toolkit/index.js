import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer'
import rsync from 'redux-rsync'

export const store = configureStore({
  reducer: rootReducer,
  middleware: [rsync]
})
