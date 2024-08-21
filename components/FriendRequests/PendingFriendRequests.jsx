import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingFriendRequests = () => {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const res = await axios.get('/api/friend-requests/pending');
                setFriendRequests(res.data);
            } catch (err) {
                console.error(err.response.data);
            }
        };

        fetchFriendRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            await axios.post('/api/friend-requests/accept', { requestId });
            setFriendRequests(friendRequests.filter(req => req._id !== requestId));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post('/api/friend-requests/reject', { requestId });
            setFriendRequests(friendRequests.filter(req => req._id !== requestId));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <h2>Pending Friend Requests</h2>
            {friendRequests.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                <ul>
                    {friendRequests.map(req => (
                        <li key={req._id}>
                            {req.sender.name} ({req.sender.email})
                            <button onClick={() => handleAccept(req._id)}>Accept</button>
                            <button onClick={() => handleReject(req._id)}>Reject</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingFriendRequests;
