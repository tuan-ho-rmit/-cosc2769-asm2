import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Groupnav from '../../components/groupnav';
import { useAuth } from '../../provider/AuthProvider';

const ManageGroup = () => {
  const { user } = useAuth()
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async (userId) => {
      if (!userId) {
        console.error("User ID is undefined.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/groups/list?createdBy=${userId}`);
        const result = await response.json();
        console.log("My groups:", result.data);  // 서버에서 받아온 그룹 정보 확인
        setGroups(result.data || []);  // 데이터가 없으면 빈 배열 설정
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);  // 에러가 발생하면 빈 배열 설정
      }
    };
    fetchGroups(user.id);  // 오브젝트 아이디를 기반으로 그룹 필터링
  }, []);

  const handleManageMembers = (groupName) => {
    navigate(`/groupmembermanagement/${groupName}`);
  };

  const handleManagePosts = (groupId) => {
    navigate(`/manage-group-posts/${groupId}`);
  };  

  const handleDelete = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/groups/${groupId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setGroups(groups.filter(group => group._id !== groupId));
        } else {
          throw new Error('Failed to delete group');
        }
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  return (
    <>
      <Groupnav />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Manage My Groups</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(410px, 1fr))', gap: '1rem' }}>
          {groups.length > 0 ? (
            groups.map(group => (
              <div key={group._id} style={{ backgroundColor: '#393E46', padding: '1.3rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.3rem' }}>
                  <img
                    src={group.avatar}
                    alt={group.groupName}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', marginRight: '1.3rem' }}
                  />
                  <h3 style={{ color: '#FFD369', margin: 0 }}>{group.groupName}</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {group.status === 'pending' ? (
                    // 그룹 상태가 "pending"인 경우 "Pending" 버튼만 표시
                    <button
                      style={{
                        padding: '0.7rem 1.2rem',
                        backgroundColor: '#555',
                        color: '#ccc',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'not-allowed',
                        marginRight: '0.5rem',
                      }}
                      disabled
                    >
                      Pending
                    </button>
                  ) : (
                    // 그룹 상태가 "pending"이 아닌 경우 "Manage Members"와 "Manage Posts" 버튼 표시
                    <>
                      <button
                        onClick={() => handleManageMembers(group.groupName)}
                        style={{
                          padding: '0.7rem 1.2rem',
                          backgroundColor: '#FFD369',
                          color: '#222831',
                          borderRadius: '0.25rem',
                          border: 'none',
                          cursor: 'pointer',
                          marginRight: '0.5rem',
                        }}
                      >
                        Manage Members
                      </button>
                      <button
                        onClick={() => handleManagePosts(group._id)}
                        style={{
                          padding: '0.7rem 1.2rem',
                          backgroundColor: '#FFD369',
                          color: '#222831',
                          borderRadius: '0.25rem',
                          border: 'none',
                          cursor: 'pointer',
                          marginRight: '0.5rem'
                        }}
                      >
                        Manage Posts & Comments
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(group._id)}
                    style={{ padding: '0.7rem 1.2rem', backgroundColor: '#222831', color: '#EEEEEE', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#FFD369' }}>You have no groups to manage.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageGroup;
