import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('User logged in:', result);
    } catch (error) {
      console.error('Error logging in user:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-grey shadow-md rounded-lg" style={{ marginTop: '2rem' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Enter Your Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Enter a New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter a New Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-yellow text-lg font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Log In
            </button>
            <a href="/forgot-password" className="mt-2 text-yellow text-sm hover:underline">
              Forgotten Passwords?
            </a>
          </div>
        </form>
        <div className="mt-6">
          <hr className="border-gray-600" />
          <p className="mt-4 text-center">
            <a href="/register" className="text-yellow text-lg font-bold hover:underline">
              Create new Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
