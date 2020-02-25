import React from 'react'
import logo from '../logo.svg'
import './App.css'
import { Provider } from 'react-redux'
import { store } from '../redux'
import PostRedux from './PostRedux'

function AppRedux () {
  return (
    <Provider store={store}>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            RSync Implementation using Plain Redux
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
            <PostRedux />
          </a>
        </header>
      </div>
    </Provider>
  )
}

export default AppRedux
