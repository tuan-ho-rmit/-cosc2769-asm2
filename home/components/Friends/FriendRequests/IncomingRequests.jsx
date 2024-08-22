import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IncomingRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get('/api/friendrequests');
                setRequests(res.data);
            } catch (err) {
                console.error(err.response.data);
            }
        };
        fetchRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            await axios.put(`/api/friendrequests/${requestId}/accept`);
            setRequests(requests.filter(req => req._id !== requestId));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.put(`/api/friendrequests/${requestId}/reject`);
            setRequests(requests.filter(req => req._id !== requestId));
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <h3>Incoming Friend Requests</h3>
            {requests.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                requests.map(req => (
                    <div key={req._id}>
                        <p>{req.sender.name} wants to be friends!</p>
                        <button onClick={() => handleAccept(req._id)}>Accept</button>
                        <button onClick={() => handleReject(req._id)}>Reject</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default IncomingRequests;
