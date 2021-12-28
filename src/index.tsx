import React from 'react';
import ReactDOM from 'react-dom';
import '@styles/index.css';
import App from './App';
import '@core/i18n';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
