import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Groupnav from '../../components/groupnav';

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 유저 세션에서 사용자 오브젝트 아이디 가져오기
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('User session data:', storedUser); // 유저 세션 데이터 확인

      if (storedUser && storedUser.id) {  // storedUser._id 대신 storedUser.id 사용
        setUserId(storedUser.id);
        console.log('User ID:', storedUser.id); // 유저 ID 확인
        fetchGroups(storedUser.id);
      } else {
        console.error('No user data found in session or User ID is undefined.');
      }
    };

    // 사용자가 가입한 그룹들만 가져오기
    const fetchGroups = async (userId) => {
      try {
        const response = await fetch('http://localhost:3000/api/groups');
        const result = await response.json();
        console.log('Fetched groups:', result); // 가져온 그룹 데이터 확인

        // 내가 가입한 그룹만 필터링
        const myGroups = result.filter(group => {
          console.log(`Checking group "${group.groupName}" with members:`, group.members); // 각 그룹의 멤버 확인
          const isMember = group.members.includes(userId);
          console.log(`User ${userId} is member of "${group.groupName}":`, isMember); // 해당 그룹에 유저가 포함되어 있는지 확인
          return isMember;
        });

        console.log('My groups:', myGroups); // 필터링된 나의 그룹들 확인
        setGroups(myGroups);
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
    <>
    <Groupnav/>
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
    </>
  );
};

export default Group;
