import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  // Allow hitting Space to enter
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        navigate('/login');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-uncensored text-white flex flex-col items-center justify-center">
      <div
        className="text-center leading-tight font-propaganda"
        style={{
          fontSize: "clamp(64px, 10vw, 140px)",
          fontWeight: 400,
          letterSpacing: "-1px",
        }}
      >
        NEED TO SH*T?
      </div>
      <Link
        to="/login"
        className="mt-12 px-10 py-3 border border-white rounded-full text-white font-uncensored font-semibold hover:bg-white hover:text-blue-uncensored transition"
      >
        Enter
      </Link>
    </div>
  );
};

export default Landing;

