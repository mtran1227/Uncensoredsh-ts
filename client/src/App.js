import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import User from './components/User';
import Account from './components/Account';
import Loading from './components/Loading';
import Rating from './components/Rating';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 This is the homepage */}
        <Route path="/" element={<Home />} />

        {/* Other pages */}
        <Route path="/user" element={<User />} />
        <Route path="/account" element={<Account />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/rating" element={<Rating />} />
      </Routes>
    </Router>
  );
}

export default App;
