import React, { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import App1 from './app1/App1'

function App() {

  return (
    <Router>
      <App1 />
    </Router>
  );
}

export default App;
