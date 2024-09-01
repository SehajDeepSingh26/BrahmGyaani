// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import rootReducer from './reducer/index.js'
import { configureStore } from '@reduxjs/toolkit'
import { Toaster } from 'react-hot-toast'
import React from 'react'

const store = configureStore({
    reducer: rootReducer,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>

        <BrowserRouter>
            <App/>
            <Toaster/>     {/* //^ listens for toast components and renders them. */}
        </BrowserRouter>

    </Provider>
   </React.StrictMode>
)
