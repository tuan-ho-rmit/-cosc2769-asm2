import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 유저 세션에서 사용자 오브젝트 아이디 가져오기
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUserId(storedUser._id);
        fetchGroups(storedUser._id);
      }
    };

    // 사용자가 가입한 그룹들을 가져오기
    const fetchGroups = async (userId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/groups?memberId=${userId}`);
        const result = await response.json();
        setGroups(result);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchUser();
  }, []);

  // Visit 버튼 핸들러
  const handleVisit = (groupId) => {
    navigate(`/groupmain/${groupId}`);
  };

  // Delete 버튼 핸들러
  const handleDelete = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/remove-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, userId }),
      });

      if (response.ok) {
        setGroups(groups.filter(group => group._id !== groupId));
      } else {
        throw new Error('Failed to remove member from group');
      }
    } catch (error) {
      console.error('Error removing member from group:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>My Groups</h2>
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
                onClick={() => handleVisit(group._id)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                Visit
              </button>
              <button
                onClick={() => handleDelete(group._id)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Group;
