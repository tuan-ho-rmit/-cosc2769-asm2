import React from 'react';
import axios from 'axios';

const FriendRequestButton = ({ receiverId }) => {
    const sendRequest = async () => {
        try {
            await axios.post('/api/friendrequests', { receiverId });
            alert('Friend request sent!');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return <button onClick={sendRequest}>Send Friend Request</button>;
};

export default FriendRequestButton;
