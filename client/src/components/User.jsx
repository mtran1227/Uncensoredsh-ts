import React from 'react';
import { Link } from 'react-router-dom';

const User = () => {
  return (
    <div style={{ width: 375, height: 812, position: 'relative', background: 'white' }}>
      {/* Navigation Bar */}
      <div style={{ width: '100%', height: 50, position: 'absolute', top: 0, left: 0, background: '#004DFF', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Home</Link>
        <Link to="/user" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Browse</Link>
        <Link to="/account" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Account</Link>
      </div>

      {/* Add your original User page content here, offset it to not overlap the nav bar */}
      <div style={{ marginTop: 60, padding: 20 }}>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 600 }}>Bathroom Rankings</h2>
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default User;
