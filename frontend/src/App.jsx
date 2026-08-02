import { useState } from 'react'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error('Fetch failed:', err));
  }, []);

  return (
    <div>
      <h1>Splitwise Tracker</h1>
    </div>
  );
}

export default App;
