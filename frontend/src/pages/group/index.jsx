import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Groupnav from '../../components/groupnav';
import { useAuth } from '../../provider/AuthProvider';

const Group = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // 팝업 상태
  const [selectedGroupId, setSelectedGroupId] = useState(null); // 탈퇴할 그룹 ID
  const navigate = useNavigate();

  useEffect(() => {
    // 유저 세션에서 사용자 오브젝트 아이디 가져오기
    const fetchUser = () => {
      if (user && user.id) {
        setUserId(user.id);
        fetchGroups(user.id);
      } else {
        console.error('No user data found in session or User ID is undefined.');
      }
    };

    // 사용자가 가입한 그룹들만 가져오기
    const fetchGroups = async (userId) => {
      try {
        const response = await fetch('http://localhost:3000/api/groups');
        const result = await response.json();
        const myGroups = result.filter(group => group.members.includes(userId));
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

  // 그룹 탈퇴 처리 핸들러
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/remove-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: selectedGroupId, userId }),
      });

      if (response.ok) {
        setGroups(groups.filter(group => group._id !== selectedGroupId));
        setShowConfirmPopup(false); // 팝업 닫기
      } else {
        throw new Error('Failed to remove member from group');
      }
    } catch (error) {
      console.error('Error removing member from group:', error);
    }
  };

  // Leave 버튼 클릭 시 팝업 표시
  const handleLeaveClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowConfirmPopup(true);
  };

  // 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setShowConfirmPopup(false);
  };

  return (
    <>
      <Groupnav />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>My Groups</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}> {/* 박스 길이 좌우 40% 확대 */}
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
                {group.status === 'pending' ? (
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#555',
                      color: '#ccc',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'not-allowed',
                    }}
                    disabled
                  >
                    Not Approved
                  </button>
                ) : (
                  <button
                    onClick={() => handleVisit(group._id)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                  >
                    Visit
                  </button>
                )}
                {group.createdBy === userId ? (
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#555',
                      color: '#ccc',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'not-allowed',
                    }}
                    disabled
                  >
                    Owned
                  </button>
                ) : (
                  <button
                    onClick={() => handleLeaveClick(group._id)} // 팝업을 표시하는 핸들러
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                  >
                    Leave
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 확인 팝업 */}
      {showConfirmPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#393E46', padding: '2rem', borderRadius: '0.5rem',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', textAlign: 'center', width: '400px'
          }}>
            <h3 style={{ color: '#FFD369', marginBottom: '1.5rem' }}>Are you sure you want to leave this group? If you leave, you will need to request to join again and wait for the group owner's approval.</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={handleDelete}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                Yes
              </button>
              <button
                onClick={handleClosePopup}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Group;
