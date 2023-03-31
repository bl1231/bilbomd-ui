import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { store } from 'app/store'
import { Provider as ReduxProvider } from 'react-redux'

import { BrowserRouter, Routes, Route, useRouteError } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/bilbomd-dev/*"
            element={<App />}
            errorElement={<ErrorBoundary />}
          />
        </Routes>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
)

function ErrorBoundary() {
  let error = useRouteError()
  console.error(error)
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>
}
