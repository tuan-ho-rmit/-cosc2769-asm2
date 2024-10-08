import {useEffect, useState} from "react";
import UnfriendAction from "../actions/UnfriendAction.jsx";
import BasePaginationList from "../../../../components/pagination/BasePaginationList.jsx";
import Button from "../../../../components/button/index.jsx";
import {NavLink} from "react-router-dom";

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true) // loading state
    const [currentUser, setCurrentUser] = useState(null) // current user ID
    const [friendRequest, setFriendRequest] = useState()
    const [request, setRequest] = useState(null) // process friend request data

    // fetch friend requests and user data
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

            // extract relevant data from current user
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

            // fetch all friend request
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

            // filter accepted friend requests based on user involvement (sent or received)
            const acceptedRequests = allFriendRequests.filter(request => ((request.status === 'accepted') && (request.toId === currentUserId)) || ((request.status === 'accepted') && (request.fromId === currentUserId)))
            console.log('accepted rq:', acceptedRequests)

            // remove duplicated requests by user pair (fromId and toId)
            const uniqueRequests = [];
            const seenPairs = new Set();
            acceptedRequests.forEach(request => {
                const {fromId, toId} = request;
                const pairKey = fromId < toId ? `${fromId}-${toId}` : `${toId}-${fromId}`;
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

                // combining requests details with users' names
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

    // display message if users have no friends yet
    if (friends.length === 0 && !loading) {
        return <p>You don't have any friends yet.</p>;
    }

    return (
        <>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "16px"
                }}
            >
                <div style={{display: "flex", flexDirection: "column", gap: "16px", margin: "0px 16px"}}>
                    {/*render friend list items if data is available*/}
                    {friends.map(friend => {
                            const displayName = (friend.fromId === currentUser)
                                ? friend.toUser  // If the currentUserId is the 'fromId', display 'toUser'
                                : friend.fromUser;  // Otherwise, display 'fromUser'

                            return (
                                <div key={friend.id}
                                     className="border p-4 rounded-md shadow-md"
                                     style={{
                                         display: "flex",
                                         flexDirection: "row",
                                         justifyContent: "flex-start",
                                         alignItems: "center",
                                         gap: "16px"
                                     }}
                                >

                                    <span>{displayName}</span>
                                    {/*render buttons to view friend's profile and unfriend*/}
                                    <Button
                                        variant='primary'
                                        size={'md'}
                                        ripple={'true'}>
                                        <NavLink
                                            to={`/user/${friend.fromId === currentUser ? friend.toId : friend.fromId}`}>
                                            View Profile
                                        </NavLink>
                                    </Button>
                                    <UnfriendAction
                                        fetchFriendRequest={fetchFriendRequest}
                                        request={friend}
                                    />
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        </>
    )
}