import React from 'react'
import logo from '../logo.svg'
import './App.css'
import { Provider } from 'react-redux'
import { store } from '../redux-sauce'
import PostReduxSauce from './PostReduxSauce'

function AppReduxSauce () {
  return (
    <Provider store={store}>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            RSync Implementation using Redux Sauce
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
            <PostReduxSauce />
          </a>
        </header>
      </div>
    </Provider>
  )
}

export default AppReduxSauce
