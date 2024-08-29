import {useEffect, useState} from "react";
import UnfriendAction from "../actions/UnfriendAction.jsx";

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)
    const [friendRequest, setFriendRequest] = useState()
    const [request, setRequest] = useState(null)

    const fetchFriendRequest = async () => {
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
        console.log('fetched current User Data:', currentUserData)
        // setCurrentUser(currentUserData.user);

        const currentData = currentUserData.user
        console.log('currentUserData.user:', currentData)

        const currentUserId = currentUserData.user.id
        console.log('currentUserData.user._id: ', currentUserId)

            setCurrentUser(currentUserId)

        const friendList = currentData.friendIds
        console.log('array of friends (currentData.friendIds): ', friendList)

        // fetch friend request

            const response = await fetch(`http://localhost:3000/api/friendrequest/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const allFriendRequests = await response.json();
            console.log('all friend requests:', allFriendRequests)
            // setFriendRequest(resultToUser)

            const acceptedRequests = allFriendRequests.filter(request => ((request.status === 'accepted') && (request.toId === currentUserId)) || ((request.status === 'accepted') && (request.fromId === currentUserId)))
            console.log ('accepted rq:', acceptedRequests)


            // testing filtering duplicated requests
            const uniqueRequests = [];
            const seenPairs = new Set();

            // Iterate over each request in acceptedRequests
            acceptedRequests.forEach(request => {
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
            console.log('requestsWithUserDetails', requestsWithUserDetails)
            setFriends(requestsWithUserDetails)
            setRequest(uniqueRequests)

        } catch (error) {
            console.error('Error fetching user:', error.message);
            throw error; // Rethrow error to handle it in the component
        }
    }


    useEffect(() => {
        fetchFriendRequest()
        setLoading(false)
    }, [])

    if (loading) return <p>Loading...</p>

    if (friends.length === 0 && !loading) {
        return <p>You don't have any friends yet.</p>;
    }

    return(
        <>
            <div>
                <h1>
                    Your Friend List
                </h1>
            </div>
            <div>
                <ul >
                    {friends.map(friend =>
                    {
                        const displayName = (friend.fromId === currentUser)
                            ? friend.toUser  // If the currentUserId is the 'fromId', display 'toUser'
                            : friend.fromUser;  // Otherwise, display 'fromUser'

                        return (
                            <li key={friend.id}
                                className="border p-4 rounded-md shadow-md">
                                <span>{displayName}</span>
                                <UnfriendAction
                                    fetchFriendRequest={fetchFriendRequest}
                                    request={friend}
                                />
                            </li>
                        );
                    }
                    )}
                </ul>
            </div>
        </>
    )
}