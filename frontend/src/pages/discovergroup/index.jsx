import React, { useState, useEffect } from 'react';
import Groupnav from '../../components/groupnav';

const DiscoverGroup = () => {
  const [groups, setGroups] = useState([]);

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

    fetchGroups();
  }, []);

  const handleView = (groupId) => {
    // View logic (e.g., redirect to a detailed view page)
    console.log('View group with ID:', groupId);
    window.location.href = `/group/${groupId}`; // 그룹 상세 페이지로 이동
  };

  const handleJoin = (groupId) => {
    // Join logic (e.g., send a join request)
    console.log('Join group with ID:', groupId);
    // 이곳에 가입 요청을 처리하는 로직 추가 가능
  };

  return (
    <>
      <Groupnav/>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleView(group._id)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                >
                  View
                </button>
                <button
                  onClick={() => handleJoin(group._id)}
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
