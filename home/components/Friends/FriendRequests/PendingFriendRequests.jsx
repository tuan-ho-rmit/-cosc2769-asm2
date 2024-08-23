import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PendingFriendRequests({ userId }) {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`/api/friend-requests/pending/${userId}`);
        setFriendRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch friend requests', error);
      }
    };

    fetchFriendRequests();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`/api/friend-requests/accept/${requestId}`);
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Failed to accept friend request', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`/api/friend-requests/reject/${requestId}`);
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Failed to reject friend request', error);
    }
  };

  return (
    <div>
      <h3>Pending Friend Requests</h3>
      <ul>
        {friendRequests.map(request => (
          <li key={request.id}>
            <p>Friend request from user ID: {request.senderId}</p>
            <button onClick={() => handleAccept(request.id)}>Accept</button>
            <button onClick={() => handleReject(request.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingFriendRequests;