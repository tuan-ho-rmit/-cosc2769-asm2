import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Groupnav from '../../components/groupnav';
import { useAuth } from '../../provider/AuthProvider';

const DiscoverGroup = () => {
  const {user} = useAuth();
  const [groups, setGroups] = useState([]);
  const [requestedGroups, setRequestedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]); // 빈 배열로 초기화
  const navigate = useNavigate();

  useEffect(() => {
    // 그룹을 가져오는 함수
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/groups?status=active');
        const result = await response.json();
        setGroups(result);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    // 유저 정보를 가져오는 함수
    const fetchUser = () => {
        fetchRequestedGroups(user.email);
        fetchJoinedGroups(user.id);
    };

    const fetchRequestedGroups = async (email) => {
      try {
        const response = await fetch(`http://localhost:3000/api/groups/requested-groups?email=${email}`);
        const result = await response.json();
        setRequestedGroups(result);
      } catch (error) {
        console.error('Error fetching requested groups:', error);
      }
    };

    const fetchJoinedGroups = async (memberId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/groups/member-groups?memberId=${memberId}`);
        const joinedGroups = await response.json();
        if (Array.isArray(joinedGroups)) {
          setJoinedGroups(joinedGroups.map(group => group.groupName));
        } else {
          console.error('Unexpected response format for joined groups:', joinedGroups);
        }
      } catch (error) {
        console.error('Error fetching joined groups:', error);
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
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      const result = await response.json();
      alert('Group join request has been submitted. Please wait for the group leader’s approval.');
      window.location.reload();
    } catch (error) {
      console.error('Error creating group join request:', error.message);
    }
  };

  const handleView = (groupName, visibility) => {
    if (visibility === 'private') {
      alert('The content of this group is private. To gain access and view its details, please request to join the group.');
      return;
    }
    // 그룹 이름을 사용하여 네비게이션
    navigate(`/groupmainvisit/${groupName}`);
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleView(group.groupName, group.visibility)}  
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                >
                  View
                </button>
                {joinedGroups.includes(group.groupName) ? (
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#555',
                      color: '#ccc',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'not-allowed'
                    }}
                    disabled
                  >
                    Joined
                  </button>
                ) : requestedGroups.includes(group.groupName) ? (
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#555',
                      color: '#ccc',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'not-allowed'
                    }}
                    disabled
                  >
                    Requested!
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(group.groupName)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#222831',
                      color: '#EEEEEE',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DiscoverGroup;
