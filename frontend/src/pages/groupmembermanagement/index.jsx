import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Groupnav from '../../components/groupnav';
import { useAuth } from '../../provider/AuthProvider';

const GroupMemberManagement = () => {
  const {user} = useAuth()
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]); // reset as empty array
  const { groupName } = useParams();
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState('');

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (user && user.id) {
          setUserId(user.id);
        } else {
          console.error('No user data found in session or User ID is undefined.');
        }

        // get group Id
        const responseGroupId = await fetch(`http://localhost:3000/api/groups/get-group-id/${groupName}`);
        const groupIdData = await responseGroupId.json();
        setCurrentGroupId(groupIdData._id);

        // get group join req
        const responseJoinRequests = await fetch(`http://localhost:3000/api/groups/join-requests?groupName=${groupName}`);
        const resultJoinRequests = await responseJoinRequests.json();
        setRequests(resultJoinRequests);

        // get group members
        const responseMembers = await fetch(`http://localhost:3000/api/groups/${groupName}/members`);
        const resultMembers = await responseMembers.json();
        setMembers(resultMembers);

        // get suspended users
        const responseSuspendedUsers = await fetch(`http://localhost:3000/api/groups/suspended-users/${groupIdData._id}`);
        const resultSuspendedUsers = await responseSuspendedUsers.json();
        // check for suspended user is array
        if (Array.isArray(resultSuspendedUsers)) {
          setSuspendedUsers(resultSuspendedUsers);
        } else {
          setSuspendedUsers([]);  // reset as empty array if its not array
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [groupName]);

  // popup func (Accept, Reject, Expel, Suspend ...)
  const handleActionClick = (action, id, email = '') => {
    setActionType(action);
    setSelectedId(id);
    setSelectedEmail(email);
    setShowConfirmPopup(true);
  };

  // Accept, Reject req
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
        setShowConfirmPopup(false);

        // rerender page to show updated data
        window.location.reload();  // rerender
      } else {
        throw new Error(`Failed to ${actionType.toLowerCase()} request`);
      }
    } catch (error) {
      console.error(`Error ${actionType.toLowerCase()} request:`, error);
    }
  };

  // suspend req handle
  const handleSuspend = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/groups/suspend-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: currentGroupId, userId: selectedId, userEmail: selectedEmail }),
      });

      if (response.ok) {
        setSuspendedUsers([...suspendedUsers, { userId: selectedId, userEmail: selectedEmail }]);
        setShowConfirmPopup(false);
      } else {
        throw new Error('Failed to suspend member');
      }
    } catch (error) {
      console.error('Error suspending member:', error);
    }
  };

  // unsuspend req handle
  const handleUnsuspend = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/unsuspend-member/${currentGroupId}/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuspendedUsers(suspendedUsers.filter(user => user.userId !== selectedId));
        setShowConfirmPopup(false);
      } else {
        throw new Error('Failed to unsuspend member');
      }
    } catch (error) {
      console.error('Error unsuspending member:', error);
    }
  };

  // dekete member handle
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
      setShowConfirmPopup(false);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  // close popup handle
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
                      onClick={() => handleActionClick('Reject', request._id)}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleActionClick('Accept', request._id, request.userEmail)}
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
                          onClick={() => handleActionClick('Expel', member._id)}
                          style={{ padding: '0.5rem 1rem', backgroundColor: '#FF4E4E', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                        >
                          Expel
                        </button>

                        {/* check is suspended user */}
                        {/* {suspendedUsers.some(suspended => suspended.userId === member._id) ? (
                          <button
                            onClick={() => handleActionClick('Unsuspend', member._id)}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: '#FFFFFF', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActionClick('Suspend', member._id, member.email)}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                          >
                            Suspend
                          </button>
                        )} */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                onClick={actionType === 'Suspend' ? handleSuspend : actionType === 'Unsuspend' ? handleUnsuspend : actionType === 'Expel' ? handleRemoveMember : handleAcceptReject}
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
