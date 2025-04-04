import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ width: 375, height: 812, position: 'relative', background: 'white' }}>
      {/* Navigation Bar */}
      <div style={{ width: '100%', height: 50, position: 'absolute', top: 0, left: 0, background: '#004DFF', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Home</Link>
        <Link to="/user" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Browse</Link>
        <Link to="/account" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Account</Link>
      </div>

      <div style={{ width: 112, height: 112, left: 131, top: 214, position: 'absolute', background: '#004DFF', borderRadius: 9999 }}></div>
      <div style={{ left: 85, top: 167, position: 'absolute', textAlign: 'center', color: '#004DFF', fontSize: 24, fontFamily: 'Propaganda', fontWeight: '400', wordWrap: 'break-word' }}>uncensored sh*ts</div>
      <div style={{ left: 147, top: 331, position: 'absolute', textAlign: 'center', color: '#004DFF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: '22.40px', wordWrap: 'break-word' }}>
        join the sh*tshow
      </div>
      <div style={{ width: 135, height: 36, left: 120, top: 387, position: 'absolute', background: '#004DFF', borderRadius: 9999 }}></div>
      <div style={{ left: 145, top: 392, position: 'absolute', color: 'white', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: '22.40px', wordWrap: 'break-word' }}>sign up</div>
      <div style={{ left: 109, top: 446, position: 'absolute', textAlign: 'center', color: '#004DFF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: '22.40px', wordWrap: 'break-word' }}>
        already a sh*tter?
      </div>
      <div style={{ width: 135, height: 36, left: 120, top: 492, position: 'absolute', background: '#004DFF', borderRadius: 9999 }}></div>
      <div style={{ left: 145, top: 497, position: 'absolute', color: 'white', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: '22.40px', wordWrap: 'break-word' }}>log in</div>
    </div>
  );
};

export default Home;
