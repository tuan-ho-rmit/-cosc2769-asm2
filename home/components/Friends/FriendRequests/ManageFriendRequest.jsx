import React from 'react';
import axios from 'axios';

function ManageFriendRequest({ requestId }) {
  const handleAccept = async () => {
    try {
      await axios.put(`/api/friend-requests/accept/${requestId}`);
      alert('Friend request accepted');
    } catch (error) {
      console.error('Failed to accept friend request', error);
    }
  };

  const handleDecline = async () => {
    try {
      await axios.put(`/api/friend-requests/decline/${requestId}`);
      alert('Friend request declined');
    } catch (error) {
      console.error('Failed to decline friend request', error);
    }
  };

  return (
    <div>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
    </div>
  );
}

export default ManageFriendRequest;