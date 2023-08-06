/* React */
import React from 'react';
import ReactDOM from 'react-dom/client';
/* Router */
import { BrowserRouter } from 'react-router-dom';
/* Redux */
import { Provider as ReduxProvider } from 'react-redux';

/* Root Component */
import App from './App';
/* Store */
import store from './store/store';
/* Styles */
import './main.scss';
import './styles/root.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>
);
