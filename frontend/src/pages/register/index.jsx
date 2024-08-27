import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // 추가된 부분

// default img url
import defaultAvatar from './defaultAvatar.png'; 

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    avatar: defaultAvatar, // default img.
  });

  const navigate = useNavigate(); // 추가된 부분

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result, // replace it to uploaded img.
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
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
      console.log('User registered:', result);

      navigate('/login'); // 회원가입 성공 시 /login으로 리디렉트
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 shadow-md rounded-lg" style={{ marginTop: '2rem', backgroundColor: '#393E46' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <img
              src={formData.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4"
              style={{ borderColor: '#FFD369' }}
            />
            <label
              htmlFor="avatar"
              className="mt-4 px-4 py-2 text-sm rounded-full cursor-pointer"
              style={{ border: '1px solid #FFD369', color: '#FFD369' }}
            >
              Upload a Photo
              <input
                id="avatar"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-white">Enter Your Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ color: '#222831' }}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-white">Enter Your First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ color: '#222831' }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Enter Your Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={{ color: '#222831' }}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Enter a New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={{ color: '#222831' }}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Re-enter the Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={{ color: '#222831' }}
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={{ color: '#222831' }}
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-white">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={{ color: '#222831' }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-lg font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#222831', color: '#FFD369' }}
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-white">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Log in</a> instead
        </p>
      </div>
    </div>
  );
};

export default Register;
