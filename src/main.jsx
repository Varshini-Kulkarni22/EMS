import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store'; // make sure this is correctly exported
import './index.css';
import { initializeAdmin } from './utils/initializeAdmin';
import {UserProvider} from './contexts/UserContext'; // Import UserProvider
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.toggle('dark', theme === 'dark');
initializeAdmin();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <UserProvider> {/* Wrap App with UserProvider */}
    <App />
    </UserProvider>
  </Provider>
);
