import React from 'react';
import { Link } from 'react-router-dom';

const Loading = () => {
  return (
    <div style={{ width: 375, height: 812, position: 'relative', background: 'white', overflow: 'hidden' }}>
      {/* Navigation Bar */}
      <div style={{ width: '100%', height: 50, position: 'absolute', top: 0, left: 0, background: '#004DFF', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1 }}>
        <Link to="/" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Home</Link>
        <Link to="/user" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Browse</Link>
        <Link to="/account" style={{ color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', textDecoration: 'none' }}>Account</Link>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: 60 }}>
        <div style={{ left: 96, top: 267, position: 'absolute', textAlign: 'center', color: '#004DFF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: '22.40px', wordWrap: 'break-word' }}>
          the creators of this sh*t
        </div>
        <div style={{ width: 135, height: 135, left: 120, top: 88, position: 'absolute', background: '#004DFF', borderRadius: '9999px' }} />
        <div style={{ left: 71, top: 44, position: 'absolute', textAlign: 'justify', color: '#004DFF', fontSize: 20, fontFamily: 'Propaganda', fontWeight: '400', wordWrap: 'break-word' }}>
          @uncensoredshts
        </div>
        <div style={{ left: 48, top: 230, position: 'absolute', textAlign: 'justify', color: '#004DFF', fontSize: 24, fontFamily: 'Propaganda', fontWeight: '400', wordWrap: 'break-word' }}>
          uncensored sh*ts
        </div>
        <div style={{ left: 147, top: 307, position: 'absolute', textAlign: 'center' }}>
          <span style={{ color: '#004DFF', fontSize: 15, fontFamily: 'Inter', fontWeight: '700', lineHeight: '21px', wordWrap: 'break-word' }}>313 </span>
          <span style={{ color: '#004DFF', fontSize: 15, fontFamily: 'Inter', fontWeight: '400', lineHeight: '21px', wordWrap: 'break-word' }}>friends</span>
        </div>
        <div style={{ width: 52, height: 60, left: 96, top: 346, position: 'absolute', background: '#004DFF' }} />
        <div style={{ width: 52, left: 96, top: 409, position: 'absolute', textAlign: 'center', color: '#004DFF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: '22.40px', wordWrap: 'break-word' }}>
          sh*t in
        </div>
        <div style={{ width: 52, height: 60, left: 227, top: 346, position: 'absolute', background: '#004DFF' }} />
        <div style={{ left: 197, top: 408, position: 'absolute', textAlign: 'right', color: '#004DFF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: '22.40px', wordWrap: 'break-word' }}>
          want to sh*t in
        </div>
        <div style={{ width: 30, left: 107, top: 349, position: 'absolute', textAlign: 'justify', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 40, fontFamily: 'FONTSPRING DEMO - Vanguard CF Extra Bold', fontWeight: '800', wordWrap: 'break-word' }}>
          12
        </div>
      </div>
    </div>
  );
};

export default Loading;
