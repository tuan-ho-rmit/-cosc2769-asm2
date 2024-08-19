import React, { useState } from 'react';
import defaultAvatar from './defaultAvatar.png';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
    avatar: defaultAvatar,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result,
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

    const groupData = {
      ...formData,
      status: 'pending',
      createdBy: null,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:3000/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(`Your group: ${result.groupName} is successfully registered! Wait for system admin's approval.`);
      console.log('Group created:', result);
    } catch (error) {
      console.error('Error creating group:', error.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '28rem', padding: '2rem', backgroundColor: '#393E46', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#EEEEEE' }}>Create Group</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <img
              src={formData.avatar}
              alt="Group Avatar"
              style={{ width: '6rem', height: '6rem', borderRadius: '9999px', border: '4px solid #FFD369' }}
            />
            <label
              htmlFor="avatar"
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', border: '1px solid #FFD369', color: '#FFD369', fontSize: '0.875rem', borderRadius: '9999px', cursor: 'pointer' }}
            >
              Upload Group Image
              <input
                id="avatar"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div>
            <label htmlFor="groupName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#EEEEEE' }}>Group Name</label>
            <input
              id="groupName"
              type="text"
              name="groupName"
              placeholder="Enter Group Name"
              value={formData.groupName}
              onChange={handleChange}
              required
              style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #C5C5C5', borderRadius: '0.375rem', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', outline: 'none', fontSize: '0.875rem', backgroundColor: '#FFFFFF', color: '#222831' }}
            />
          </div>
          <div>
            <label htmlFor="description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: '#EEEEEE' }}>Group Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter Group Description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #C5C5C5', borderRadius: '0.375rem', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', outline: 'none', fontSize: '0.875rem', backgroundColor: '#FFFFFF', color: '#222831' }}
            />
          </div>
          <div>
            <button
              type="submit"
              style={{ width: '100%', padding: '0.5rem 1rem', backgroundColor: '#222831', color: '#EEEEEE', fontSize: '1.125rem', fontWeight: 'bold', borderRadius: '0.375rem', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', outline: 'none' }}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
