import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BathroomProfile from './components/BathroomProfile';  // 👈 import it!


import Account from './components/Account';
// (No User import!)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/bathrooms/:id" element={<BathroomProfile />} />

        {/* (No User route!) */}
      </Routes>
    </Router>
  );
}

export default App;
