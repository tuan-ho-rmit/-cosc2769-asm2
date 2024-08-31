import {useEffect, useState} from "react";
import FriendRequestActions from "../actions/FriendRequestActions.jsx";

export default function FriendRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
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

            // testing filtering duplicated requests
            const uniqueRequests = [];
            const seenPairs = new Set();

            // Iterate over each request in acceptedRequests
            pendingRequestsForCurrentUser.forEach(request => {
                const {fromId, toId} = request;

                // Create a unique key for the pair
                const pairKey = fromId < toId ? `${fromId}-${toId}` : `${toId}-${fromId}`;

                // If this pairKey has not been seen before, add it to the Set and push to uniqueRequests
                if (!seenPairs.has(pairKey)) {
                    seenPairs.add(pairKey);
                    uniqueRequests.push(request);
                }
            })

            console.log('unique requests: ', uniqueRequests)

            // Fetch user details for each request
            const requestsWithUserDetails = await Promise.all(uniqueRequests.map(async (request) => {
                const {fromId, toId} = request;

                // Fetch details for fromId
                const fromUserResponse = await fetch(`http://localhost:3000/api/users/${fromId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!fromUserResponse.ok) {
                    const errorText = await fromUserResponse.text();
                    throw new Error(`HTTP error! Status: ${fromUserResponse.status}, Message: ${errorText}`);
                }
                const fromUserData = await fromUserResponse.json();
                console.log('fromUserDAta:', fromUserData.data.firstName)

                // Fetch details for toId
                const toUserResponse = await fetch(`http://localhost:3000/api/users/${toId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!toUserResponse.ok) {
                    const errorText = await toUserResponse.text();
                    throw new Error(`HTTP error! Status: ${toUserResponse.status}, Message: ${errorText}`);
                }
                const toUserData = await toUserResponse.json();
                console.log('toUserData:', toUserData.data.firstName);

                return {
                    ...request,
                    fromUser: `${fromUserData.data.firstName} ${fromUserData.data.lastName}`,
                    toUser: `${toUserData.data.firstName} ${toUserData.data.lastName}`
                };
            }))

            console.log('requestsWithUserDetails: ', requestsWithUserDetails)

            // set the useState
            setRequests(requestsWithUserDetails)
        } catch (error) {
            console.log('error fetching pending requests:', error);
        }
    }

    useEffect(() => {
        fetchPendingFriendRequest()
        setLoading(false)
    }, [currentUser]);

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
                            {request.fromUser}
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