import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Groupnav from '../../components/groupnav';

const GroupMemberManagement = () => {
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const { groupName } = useParams();  // groupName을 URL에서 가져옵니다.
  const [currentGroupId, setCurrentGroupId] = useState(null);  // groupId를 상태로 관리합니다.

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Fetch group ID by group name
        const responseGroupId = await fetch(`http://localhost:3000/api/groups/get-group-id/${groupName}`);
        const groupIdData = await responseGroupId.json();
        setCurrentGroupId(groupIdData._id);  // 현재 그룹의 ID를 설정합니다.

        // 그룹 조인 요청을 가져옵니다.
        const responseJoinRequests = await fetch(`http://localhost:3000/api/groups/join-requests?groupName=${groupName}`);
        const resultJoinRequests = await responseJoinRequests.json();
        setRequests(resultJoinRequests);

        // 그룹 멤버를 가져옵니다.
        const responseMembers = await fetch(`http://localhost:3000/api/groups/${groupName}/members`);
        const resultMembers = await responseMembers.json();
        setMembers(resultMembers);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [groupName]);

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch('http://localhost:3000/api/groups/remove-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: currentGroupId, userId: memberId }),  // currentGroupId를 사용합니다.
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove member');
      }
  
      alert('Member removed successfully');
      setMembers(members.filter(member => member._id !== memberId));  // 상태를 업데이트하여 멤버 제거를 반영합니다.
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    }
  };

  return (
    <>
      <Groupnav />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Manage Members for {groupName}</h2>

        <div>
          <h3 style={{ color: '#FFD369', marginBottom: '1rem' }}>Accept Group Join Requests</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {requests.map(request => (
              <div key={request._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#FFD369', margin: 0 }}>{request.userEmail}</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleReject(request._id)}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(request)}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#FFD369', marginBottom: '1rem' }}>Manage Current Members</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {members.map(member => (
              <div key={member._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#FFD369', margin: 0 }}>{member.email}</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                    >
                      Expel
                    </button>
                    <button
                      onClick={() => alert('Suspend feature is coming soon!')}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupMemberManagement;
