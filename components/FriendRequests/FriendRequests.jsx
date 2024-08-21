import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequests = () => {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        // Fetch the user's friend requests
        const fetchFriendRequests = async () => {
            try {
                const res = await axios.get('/api/users/friend-requests');
                setFriendRequests(res.data);
            } catch (err) {
                console.error(err.response.data);
            }
        };

        fetchFriendRequests();
    }, []);

    const handleAcceptRequest = async (senderId) => {
        try {
            await axios.post('/api/friends/accept', { senderId });
            setFriendRequests(friendRequests.filter(request => request.senderId !== senderId));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <h3>Friend Requests</h3>
            {friendRequests.length > 0 ? (
                friendRequests.map(request => (
                    <div key={request.senderId}>
                        <p>{request.senderName}</p>
                        <button onClick={() => handleAcceptRequest(request.senderId)}>Accept</button>
                    </div>
                ))
            ) : (
                <p>No friend requests</p>
            )}
        </div>
    );
};

export default FriendRequests;
