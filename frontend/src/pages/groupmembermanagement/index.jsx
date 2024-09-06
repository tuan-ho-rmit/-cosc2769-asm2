import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Groupnav from '../../components/groupnav';

const GroupMemberManagement = () => {
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const { groupName } = useParams();  // groupName을 URL에서 가져옵니다.
  const [currentGroupId, setCurrentGroupId] = useState(null);  // groupId를 상태로 관리합니다.
  const [userId, setUserId] = useState(null); // 현재 로그인한 유저 ID를 저장합니다.
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);  // 팝업 상태
  const [actionType, setActionType] = useState('');  // Accept, Reject 등 액션 타입 저장
  const [selectedId, setSelectedId] = useState(null);  // 선택된 요청 ID 또는 멤버 ID
  const [selectedEmail, setSelectedEmail] = useState('');  // 선택된 유저 이메일 (Accept에서 필요)

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // 유저 세션에서 사용자 오브젝트 아이디 가져오기
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.id) {
          setUserId(storedUser.id);
        } else {
          console.error('No user data found in session or User ID is undefined.');
        }

        // 그룹 ID 가져오기
        const responseGroupId = await fetch(`http://localhost:3000/api/groups/get-group-id/${groupName}`);
        const groupIdData = await responseGroupId.json();
        setCurrentGroupId(groupIdData._id);

        // 그룹 조인 요청 가져오기
        const responseJoinRequests = await fetch(`http://localhost:3000/api/groups/join-requests?groupName=${groupName}`);
        const resultJoinRequests = await responseJoinRequests.json();
        setRequests(resultJoinRequests);

        // 그룹 멤버 가져오기
        const responseMembers = await fetch(`http://localhost:3000/api/groups/${groupName}/members`);
        const resultMembers = await responseMembers.json();
        setMembers(resultMembers);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [groupName]);

  // 팝업을 띄우는 함수 (Accept, Reject, Expel, Suspend 등)
  const handleActionClick = (action, id, email = '') => {
    setActionType(action);
    setSelectedId(id);
    setSelectedEmail(email);  // Accept에서 필요한 이메일 저장
    setShowConfirmPopup(true);  // 팝업 열기
  };

  // Accept, Reject 요청 처리
  const handleAcceptReject = async () => {
    const endpoint = actionType === 'Accept' ? 'accept-member' : `join-requests/${selectedId}`;
    const method = actionType === 'Accept' ? 'POST' : 'DELETE';
    const body = actionType === 'Accept' ? JSON.stringify({ groupName, userEmail: selectedEmail }) : null;

    try {
      const response = await fetch(`http://localhost:3000/api/groups/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        if (actionType === 'Accept') {
          const acceptedRequest = requests.find(r => r._id === selectedId);
          setRequests(requests.filter(r => r._id !== selectedId));
          setMembers([...members, { email: acceptedRequest.userEmail, _id: acceptedRequest.userId }]);
        } else {
          setRequests(requests.filter(r => r._id !== selectedId));
        }
        setShowConfirmPopup(false);  // 팝업 닫기
      } else {
        throw new Error(`Failed to ${actionType.toLowerCase()} request`);
      }
    } catch (error) {
      console.error(`Error ${actionType.toLowerCase()} request:`, error);
    }
  };

  // 멤버 제거 처리
  const handleRemoveMember = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/groups/remove-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: currentGroupId, userId: selectedId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      setMembers(members.filter(member => member._id !== selectedId));
      setShowConfirmPopup(false);  // 팝업 닫기
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  // 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setShowConfirmPopup(false);
  };

  return (
    <>
      <Groupnav />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Manage Members for {groupName}</h2>

        <div>
          <h3 style={{ color: '#FFD369', marginBottom: '1rem' }}>Accept Group Join Requests</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1rem' }}>
            {requests.map(request => (
              <div key={request._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#FFD369', margin: 0 }}>{request.userEmail}</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleActionClick('Reject', request._id)}  // Reject 액션
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleActionClick('Accept', request._id, request.userEmail)}  // Accept 액션
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1rem' }}>
            {members.map(member => (
              <div key={member._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#FFD369', margin: 0 }}>{member.email}</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* 그룹 오너는 멤버를 관리할 수 없도록 비활성화된 버튼을 보여줌 */}
                    {member._id === userId ? (
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
                        Owner
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleActionClick('Expel', member._id)}  // Expel 액션
                          style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                        >
                          Expel
                        </button>
                        <button
                          onClick={() => handleActionClick('Suspend', member._id)}  // Suspend 액션
                          style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                        >
                          Suspend
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <h3 style={{ color: '#FFD369', marginBottom: '1.5rem' }}>Are you sure you want to {actionType.toLowerCase()} this member?</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={actionType === 'Expel' ? handleRemoveMember : handleAcceptReject}  // 행동에 따라 다른 함수 호출
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

export default GroupMemberManagement;
