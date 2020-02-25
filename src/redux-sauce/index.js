import rootReducer from './reducer'
import rsync from 'redux-rsync'
import { createStore, applyMiddleware } from 'redux'

export const store = createStore(
  rootReducer,
  applyMiddleware(rsync)
)
