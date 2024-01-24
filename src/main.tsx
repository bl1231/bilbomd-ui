import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from 'app/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeContextProvider } from 'themes/ThemeContextProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </ReduxProvider>
    </ThemeContextProvider>
  </React.StrictMode>
)
