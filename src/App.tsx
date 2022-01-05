import React from 'react';
import Router from '@core/routes';
import { HashRouter } from 'react-router-dom';

const App: React.FC = function App() {
  return (
    <HashRouter>
      <Router />
    </HashRouter>
  );
};

export default App;
