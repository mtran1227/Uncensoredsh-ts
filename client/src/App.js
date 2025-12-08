import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import BathroomProfile from './components/BathroomProfile';
import Account from './components/Account';
import Landing from './components/Landing';
import Friends from './components/Friends';
import FriendProfile from './components/FriendProfile';
import BucketList from './components/BucketList';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/friends/:username" element={<ProtectedRoute><FriendProfile /></ProtectedRoute>} />
        <Route path="/bathrooms/:id" element={<ProtectedRoute><BathroomProfile /></ProtectedRoute>} />
        <Route path="/bucketlist" element={<ProtectedRoute><BucketList /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

