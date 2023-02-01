import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// for original Dave Gray jwt auth
//import { AuthProvider } from 'context/AuthProvider';

import { store } from './store';
import { Provider } from 'react-redux';

import { BrowserRouter, Routes, Route, useRouteError } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} errorElement={<ErrorBoundary />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>;
}
