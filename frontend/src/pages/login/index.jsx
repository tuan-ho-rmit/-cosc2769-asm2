import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // input data validation
    if (!email || !password) {
      alert("Email and password must not be empty");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', 
        { email, password },
        { withCredentials: true });

      if (response.status === 200) {
        // Fetch the user info after successful login
        const userResponse = await axios.get('http://localhost:3000/api/auth/user', { withCredentials: true });
        localStorage.setItem('user', JSON.stringify(userResponse.data.user)); // Save user to localStorage
        console.log('User information fetched:', userResponse.data.user);

        // Redirect to main page after setting the user
        navigate('/');
        window.location.reload(); // Reload to ensure that the header updates immediately
      } else {
        alert(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 shadow-md rounded-lg" style={{ backgroundColor: '#393E46' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Enter Your Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={{ color: '#222831' }} // 텍스트 색상을 블랙으로 설정
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Enter Your Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={{ color: '#222831' }} // 텍스트 색상을 블랙으로 설정
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-lg font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#222831', color: '#FFD369' }}
            >
              Log In
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-white">
          Forgotten Passwords? <a href="/forgot-password" className="text-indigo-600 hover:underline">Click here</a>
        </p>
        <p className="mt-4 text-center text-sm text-white">
          Don't have an account? <a href="/register" className="text-indigo-600 hover:underline">Create new Account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
