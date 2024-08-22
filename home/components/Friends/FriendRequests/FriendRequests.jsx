import React, { useState } from 'react';
import axios from 'axios';

function FriendRequest({ senderId, receiverId }) {
  const [status, setStatus] = useState('idle');

  const sendRequest = async () => {
    try {
      const response = await axios.post('/api/friend-requests/send', { senderId, receiverId });
      setStatus('sent');
    } catch (error) {
      console.error('Failed to send friend request', error);
      setStatus('error');
    }
  };

  return (
    <button onClick={sendRequest} disabled={status === 'sent'}>
      {status === 'sent' ? 'Request Sent' : 'Send Friend Request'}
    </button>
  );
}

export default FriendRequest;