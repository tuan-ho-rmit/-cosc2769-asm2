import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import FriendRequestActions from "../actions/FriendRequestActions.jsx";

export default function FriendRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const {userId} = useParams();
    const [currentUser, setCurrentUser] = useState()


    const fetchPendingFriendRequest = async () => {

        try {
            // Fetch current user
            const currentUserResponse = await fetch(`http://localhost:3000/api/auth/user`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!currentUserResponse.ok) {
                throw new Error('Error fetching current user');
            }

            const currentUserData = await currentUserResponse.json();

            console.log('currentuserdata.user: ', currentUserData.user)

            const currentUserId = currentUserData.user.id
            console.log('currentUserData.user._id: ', currentUserId)


            const response = await fetch('http://localhost:3000/api/friendrequest/',
                {
                    method: 'GET',
                    credentials: 'include'
                })
            if (!response.ok) {
                throw new Error ('Failed to fetch all requests')
            }

            const data = await response.json();
            console.log('all requests:', data)

            console.log('current user Id: ', currentUserId)
            setCurrentUser(currentUserId)

            const pendingRequests = data.filter(request => request.status === 'pending');
            console.log('pending requests: ', pendingRequests); // This will display only the requests with a "pending" status.
            // setRequests(pendingRequests)

            const pendingRequestsForCurrentUser = pendingRequests.filter(request => request.toId === currentUserId);
            console.log('incoming pending requests for current user: ', pendingRequestsForCurrentUser)

            setRequests(pendingRequestsForCurrentUser)
        } catch (error) {
            console.log('error fetching pending requests:', error);
        }
    }

    useEffect(() => {
        fetchPendingFriendRequest()
        setLoading(false)
    }, []);



    // useEffect(() => {
    //     const fetchPendingRequests = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000/api/friendrequest/pending/',
    //                 {
    //                     method: 'GET',
    //                     credentials: 'include'
    //                 })
    //             if (!response.ok) {
    //                 throw new Error ('Failed to fetch pending requests')
    //             }
    //             const data = await response.json();
    //             setRequests(data)
    //
    //             console.log(data)
    //         } catch (error) {
    //             console.log('error fetching pending requests:', error);
    //         } finally {
    //             setLoading(false)
    //         }
    //     }
    //     fetchPendingRequests();
    // }, [userId])

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
                    <div key={request.id} className="mb-4">
                        <div className="border p-4 rounded-md shadow-md">
                            {request.fromId}
                            <FriendRequestActions
                                userId = {null}
                            currentUser = {currentUser}
                            fetchFriendRequest = {fetchPendingFriendRequest}
                            request = {request}/>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}