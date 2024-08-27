import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import FriendRequestActions from "../actions/FriendRequestActions.jsx";

export default function FriendRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const {userId} = useParams();

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/friendrequest/pending/',
                    {
                        method: 'GET',
                        credentials: 'include'
                    })
                if (!response.ok) {
                    throw new Error ('Failed to fetch pending requests')
                }
                const data = await response.json();
                setRequests(data)

                console.log(data)
            } catch (error) {
                console.log('error fetching pending requests:', error);
            } finally {
                setLoading(false)
            }
        }
        fetchPendingRequests();
    }, [userId])

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div>
                <h1>Friend Requests</h1>
            </div>
            {requests.length === 0 ? (
                <p>No pending friend requests.</p>
            ) : (
                requests.map(request => (
                    <div key={request._id} className="mb-4">
                        <div className="border p-4 rounded-md shadow-md">
                            <p>From: {request.fromId.firstName} {request.fromId.lastName}</p>
                            <p>Status: {request.status}</p>
                            <FriendRequestActions requestId={request._id} />
                        </div>
                    </div>
                ))
            )}
        </>
    )
}