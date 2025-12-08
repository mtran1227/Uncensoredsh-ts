import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';  

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';

      // LOGIN sends only email + password
      // REGISTER sends username + email + password
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password
          };

      console.log("📤 Sending request to:", `${API_URL}${endpoint}`);
      console.log("Payload:", payload);

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      console.log("✅ Backend response:", response.data);

      // Save token + user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/home');
    } catch (err) {
      console.log("❌ REGISTER ERROR:", err.response?.data || err);

      setError(err.response?.data?.error || err.message || 'Something went wrong');
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div className="w-96">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/home" className="cursor-pointer inline-block">
            <div className="bg-blue-600 text-white inline-block px-4 py-1 rounded font-propaganda tracking-wide">
              UNCENSORED
            </div>

            <div className="text-blue-600 text-6xl font-propaganda tracking-wide mt-2">
              SH*TS
            </div>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-gray-200">
          <h2 className="text-center text-blue-600 text-xl mb-6">
            {isLogin ? 'sign in' : 'create an account'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <input
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required={!isLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            )}

            <input
              type="email"
              placeholder="email@domain.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <input
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-bold hover:underline"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>

          <p className="text-center mt-4 text-xs text-gray-500">
            By clicking continue, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;