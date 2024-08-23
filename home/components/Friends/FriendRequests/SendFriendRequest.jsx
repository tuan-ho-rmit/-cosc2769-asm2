import React, { useState } from 'react';
import axios from 'axios';

function SendFriendRequest({ senderId, receiverId }) {
  const [status, setStatus] = useState(null);

  const handleSendRequest = async () => {
    try {
      const response = await axios.post('/api/friend-requests/send', { senderId, receiverId });
      setStatus(response.data.message);
    } catch (error) {
      setStatus('Failed to send friend request.');
    }
  };

  return (
    <div>
      <button onClick={handleSendRequest}>Send Friend Request</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default SendFriendRequest;