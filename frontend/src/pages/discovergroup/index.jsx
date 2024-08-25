import React, { useState, useEffect } from 'react';
import Groupnav from '../../components/groupnav';

const DiscoverGroup = () => {
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/groups');
        const result = await response.json();
        setGroups(result);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
    };

    fetchGroups();
    fetchUser();
  }, []);

  const handleJoin = async (groupName) => {
    if (!user) {
      alert('You need to log in to join a group.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/groups/join-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName }),
        credentials: 'include', // 세션 쿠키 포함
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Group join request has been submitted. Please wait for the group leader’s approval.');
      console.log('Group join request created:', result);
    } catch (error) {
      console.error('Error creating group join request:', error.message);
    }
  };

  return (
    <>
      <Groupnav />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Discover Groups</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {groups.map(group => (
            <div key={group._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={group.avatar}
                  alt={group.groupName}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '1rem' }}
                />
                <h3 style={{ color: '#FFD369', margin: 0 }}>{group.groupName}</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => handleJoin(group.groupName)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#222831', color: '#EEEEEE', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DiscoverGroup;
