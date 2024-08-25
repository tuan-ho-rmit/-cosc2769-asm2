import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Groupnav from '../../components/groupnav';

const GroupMemberManagement = () => {
  const [requests, setRequests] = useState([]);
  const { groupName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/groups/join-requests?groupName=${groupName}`);
        const result = await response.json();
        setRequests(result);
      } catch (error) {
        console.error('Error fetching join requests:', error);
      }
    };

    fetchJoinRequests();
  }, [groupName]);

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/join-requests/${requestId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRequests(requests.filter(request => request._id !== requestId));
      } else {
        throw new Error('Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleAccept = async (request) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/accept-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName, userEmail: request.userEmail }),
      });
      if (response.ok) {
        setRequests(requests.filter(r => r._id !== request._id));
      } else {
        throw new Error('Failed to accept member');
      }
    } catch (error) {
      console.error('Error accepting member:', error);
    }
  };

  return (
    <>
      <Groupnav />
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Manage Members for {groupName}</h2>
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
    </>
  );
};

export default GroupMemberManagement;
